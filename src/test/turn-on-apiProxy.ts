var axios = require('axios');
require('dotenv').config();

var apiBaseURL = 'https://api.cloudflare.com/client/v4';
var zoneId = process.env.CLOUDFLARE_TENSORMIK_ZONE_ID; // แทนที่ด้วย Zone ID ของคุณ
var globalApiKey = process.env.CLOUDFLARE_GLOBAL_KEY; // แทนที่ด้วย Global API Key ของคุณ
var dnsRecordName = 'bilishare.kankawee.uk'; // แทนที่ด้วยชื่อ DNS record ที่คุณต้องการเปลี่ยนแปลง

// ฟังก์ชันสำหรับการปรับแต่ง DNS record
async function updateDNSRecordProxiedStatusON(proxied:any) {
    try {
        // ค้นหา DNS record ID
        var recordsResponse = await axios.get(`${apiBaseURL}/zones/${zoneId}/dns_records`, {
            headers: {
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL, // แทนที่ด้วยอีเมลที่ใช้กับ Cloudflare
                'X-Auth-Key': globalApiKey,
            },
            params: {
                name: dnsRecordName,
            },
        });

        var dnsRecord = recordsResponse.data.result.find((record: { name: string; }) => record.name === dnsRecordName);
        if (!dnsRecord) {
            throw new Error('DNS record not found');
        }

        // อัปเดตการตั้งค่า 'proxied'
        var updateResponse = await axios.patch(
            `${apiBaseURL}/zones/${zoneId}/dns_records/${dnsRecord.id}`,
            { proxied },
            {
                headers: {
                    'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                    'X-Auth-Key': globalApiKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('DNS record updated: ON');
    } catch (error:any) {
        console.error('Error updating DNS record:', error.message);
    }
}


updateDNSRecordProxiedStatusON(true);
