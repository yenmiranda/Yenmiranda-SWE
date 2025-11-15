import { Router } from "express";//framework
import pool from "../db.js";//database
import { protect } from '../middleware/authMiddleware.js';//authentication for secure data

const router = Router();

//create availability
router.post("/create", protect, async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const { refNo: tutorRefNo, classNo } = req.user;
  
  if (!tutorRefNo || !classNo) {
    return res.status(403).json({ error: "User is not a valid tutor." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `DELETE FROM Avail 
       WHERE TutorRefNo=? AND IsBooked=FALSE AND TimeSlot >= NOW()`,
      [tutorRefNo]
    );

    for (const item of items) {
      const { day, timeSlot } = item;
      if (!day || !timeSlot) continue;

      const today = new Date();
      const want = days.indexOf(day);
      if (want === -1) continue; 
      
      const add = (want - today.getDay() + 7) % 7;
      const startHH = timeSlot.split("-")[0];

      for (let week = 0; week < 12; week++) {
        const dt = new Date(today);
        dt.setDate(today.getDate() + add + (week * 7));

        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        const ymd = `${y}-${m}-${d}`;
        
        const startISO = `${ymd}T${startHH}:00`;

        await conn.query(
          `INSERT INTO Avail (TutorRefNo, TimeSlot, ClassNo, IsBooked)
           VALUES (?, ?, ?, FALSE)`,
          [tutorRefNo, startISO, classNo]
        );
      }
    }

    await conn.commit();
    res.status(201).json({ ok: true, message: "Availability saved for 12 weeks" });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(400).json({ error: error.message || "Failed to save availability" });
  } finally {
    conn.release();
  }
});

//check for open slots
router.get("/open", async (req, res) => {
  const classNo = req.query.classNo || req.query.course || req.query.selectedCourse;
  const date    = req.query.date || req.query.selectedDate;
  if (!classNo || !date) return res.status(400).json({ error: "classNo and date required" });

  try {
    const [rows] = await pool.query(
      `SELECT a.AvailID, a.TimeSlot, a.ClassNo, a.TutorRefNo,
              u.FirstName, u.LastName
         FROM Avail a
         JOIN Users u ON u.RefNo = a.TutorRefNo
        WHERE a.ClassNo=? AND DATE(a.TimeSlot)=? AND a.IsBooked=FALSE
        ORDER BY a.TimeSlot ASC`,
      [classNo, date]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching open slots" });
  }
});

//fetches availability of tutor
router.get("/mine", protect, async (req, res) => {

  const { refNo: tutorRefNo } = req.user; 
  if (!tutorRefNo) {
      return res.status(401).json({ error: "tutorRefNo required" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT AvailID, TimeSlot, ClassNo, IsBooked
         FROM Avail
        WHERE TutorRefNo=? AND TimeSlot >= NOW()
        ORDER BY TimeSlot ASC`,
      [tutorRefNo]
    );

    const weeklySchedule = {};
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    rows.forEach(row => {
      const dt = new Date(row.TimeSlot);
      const day = days[dt.getDay()];
      const startTime = dt.toTimeString().slice(0,5);
      
      const startHour = parseInt(startTime.split(':')[0]);
      
      let endHour;
      if (startHour === 23) {
        endHour = '00';
      } else {
        endHour = String(startHour + 1).padStart(2, '0');
      }
      const timeSlot = `${startTime}-${endHour}:00`;

      const key = `${day}-${timeSlot}`;
      
      if (!weeklySchedule[key]) {
        weeklySchedule[key] = {
          day,
          timeSlot,
          count: 0,
          bookedCount: 0
        };
      }
      
      weeklySchedule[key].count++;
      if (row.IsBooked) weeklySchedule[key].bookedCount++;
    });

    const schedule = Object.values(weeklySchedule).map(item => ({
      day: item.day,
      timeSlot: item.timeSlot,
      hasBookings: item.bookedCount > 0
    }));

    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching your availability" });
  }
});

export default router;