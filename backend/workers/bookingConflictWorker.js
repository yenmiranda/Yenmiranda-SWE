import pool from '../db.js';

async function fixZombieAvailSlots(connection) {
  const [result] = await connection.execute(
    `UPDATE Avail a
     LEFT JOIN Bookings b ON a.AvailID = b.AvailID
     SET a.IsBooked = FALSE
     WHERE a.IsBooked = TRUE
       AND b.BookingNo IS NULL
       AND a.TimeSlot >= NOW()` // Only fix future slots
  );
  return result.affectedRows;
}

async function fixMissingAvailFlags(connection) {
  const [result] = await connection.execute(
    `UPDATE Avail a
     JOIN Bookings b ON a.AvailID = b.AvailID
     SET a.IsBooked = TRUE
     WHERE a.IsBooked = FALSE`
  );
  return result.affectedRows;
}

async function cleanupOldUnbookedSlots(connection) {
  const [result] = await connection.execute(
    `DELETE FROM Avail
     WHERE TimeSlot < NOW()
       AND IsBooked = FALSE`
  );
  return result.affectedRows;
}

export async function runBookingConflictWorker() {
  console.log('Starting booking conflict worker...');
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const zombiesFixed = await fixZombieAvailSlots(connection);
    if (zombiesFixed > 0) {
      console.log(`[Worker] Fixed ${zombiesFixed} 'zombie' availability slots.`);
    }

    const ghostsFixed = await fixMissingAvailFlags(connection);
    if (ghostsFixed > 0) {
      console.log(`[Worker] Fixed ${ghostsFixed} 'ghost' booking flags.`);
    }

    const oldSlotsCleaned = await cleanupOldUnbookedSlots(connection);
    if (oldSlotsCleaned > 0) {
      console.log(`[Worker] Cleaned up ${oldSlotsCleaned} old unbooked slots.`);
    }

    await connection.commit();
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error during booking conflict worker:', error.message);
  } finally {
    if (connection) connection.release();
    console.log('🤖 Booking conflict worker finished.');
  }
}