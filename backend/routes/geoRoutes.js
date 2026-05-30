const express = require('express');
const router = express.Router();
const pool = require('../db');
const apiAuth = require('../middleware/apiAuth');

//router.use(apiAuth);

// Get all states
router.get('/states', async (req, res) => {
    const result = await pool.query('SELECT * FROM states ORDER BY state_name');
    res.json(result.rows);
});

// Get districts by state
router.get('/districts/:stateCode', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM districts WHERE state_code = $1 ORDER BY district_name',
        [req.params.stateCode]
    );
    res.json(result.rows);
});

// Get subdistricts by district
router.get('/subdistricts/:districtCode', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM subdistricts WHERE district_code = $1 ORDER BY subdistrict_name',
        [req.params.districtCode]
    );
    res.json(result.rows);
});

// Get villages by subdistrict
router.get('/villages/:subdistrictCode', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM villages WHERE subdistrict_code = $1 ORDER BY village_name LIMIT 500',
        [req.params.subdistrictCode]
    );
    res.json(result.rows);
});

// Search villages
router.get('/search', async (req, res) => {
    const q = req.query.q;
    const result = await pool.query(
        `SELECT village_name, village_code, subdistrict_code, district_code, state_code
         FROM villages
         WHERE village_name ILIKE $1
         LIMIT 20`,
        [`%${q}%`]
    );
    res.json(result.rows);
});

// Format full address
router.get('/format/:villageCode', async (req, res) => {
    const villageCode = req.params.villageCode;

    const result = await pool.query(`
        SELECT 
            v.village_name,
            sdt.subdistrict_name,
            d.district_name,
            s.state_name
        FROM villages v
        JOIN subdistricts sdt ON v.subdistrict_code = sdt.subdistrict_code
        JOIN districts d ON v.district_code = d.district_code
        JOIN states s ON v.state_code = s.state_code
        WHERE v.village_code = $1
        LIMIT 1
    `, [villageCode]);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Village not found' });
    }

    const row = result.rows[0];

    res.json({
        formatted_address: `${row.village_name} (Village), ${row.subdistrict_name}, ${row.district_name}, ${row.state_name}, India`
    });
});

module.exports = router;