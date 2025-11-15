//cleanup worker for tidying the db files

import pool from '../db.js';

//checks and clears all bookings which are booked but have no entry data
async function fixAvailSlots(connection) {
  const [result] = await connection.execute(
    `UPDATE Avail a
     LEFT JOIN Bookings b ON a.AvailID = b.AvailID
     SET a.IsBooked = FALSE
     WHERE a.IsBooked = TRUE
       AND b.BookingNo IS NULL
       AND a.TimeSlot >= NOW()` 
  );
  return result.affectedRows;
}

//checks and clears all bookings which have data but are not booked
async function fixMissingAvailFlags(connection) {
  const [result] = await connection.execute(
    `UPDATE Avail a
     JOIN Bookings b ON a.AvailID = b.AvailID
     SET a.IsBooked = TRUE
     WHERE a.IsBooked = FALSE`
  );
  return result.affectedRows;
}

//deletes availability slots which have passed
async function cleanupOldSlots(connection) {
  const [result] = await connection.execute(
    `DELETE FROM Avail
     WHERE TimeSlot < NOW()
       AND IsBooked = FALSE`
  );
  return result.affectedRows;
}

//export for running the thread
export async function runBookingConflictWorker() {
  console.log('Starting booking conflict worker...');
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const zombiesFixed = await fixAvailSlots(connection);
    if (zombiesFixed > 0) {
      console.log(`[Worker] Fixed ${zombiesFixed} 'zombie' availability slots.`);
    }

    const flagsFixed = await fixMissingAvailFlags(connection);
    if (flagsFixed > 0) {
      console.log(`[Worker] Fixed ${ghostsFixed} 'ghost' booking flags.`);
    }

    const oldSlotsCleaned = await cleanupOldSlots(connection);
    if (oldSlotsCleaned > 0) {
      console.log(`[Worker] Cleaned up ${oldSlotsCleaned} old unbooked slots.`);
    }

    await connection.commit();
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error during booking conflict worker:', error.message);
  } finally {
    if (connection) connection.release();
    console.log('Booking conflict worker finished.');
  }
}