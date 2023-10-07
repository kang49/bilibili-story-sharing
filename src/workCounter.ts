import * as fs from 'fs';

// ชื่อไฟล์ที่คุณต้องการอ่านและแก้ไข
const fileName = 'assets/cache/workCouter.txt';
export function workCouter() {
    // อ่านข้อมูลจากไฟล์
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            return;
        }

        // แปลงข้อมูลที่อ่านได้เป็นตัวเลข
        const currentValue = parseInt(data, 10);

        if (!isNaN(currentValue)) {
            // เพิ่มค่าลงไป 1
            const newValue = currentValue + 1;

            // บันทึกค่าใหม่ลงในไฟล์
            fs.writeFile(fileName, newValue.toString(), 'utf8', (err) => {
                if (err) {
                    return;
                }
            });
        }
    });
}
