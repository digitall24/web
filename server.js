const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const { create } = require('xmlbuilder2');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ftp = require('basic-ftp');
const path = require("path");

app.use(cors()); 
app.use(express.json());
app.use(express.static("public"));
app.use("/downloads", express.static(path.join(__dirname)));



function generateXml(eik, fdrid) {
    return create()
        .dec({ version: "1.0", encoding: "UTF-8" })
        .ele("dec44a2", {
            xmlns: "http://inetdec.nra.bg/xsd/dec_44a2.xsd",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://inetdec.nra.bg/xsd/dec_44a2.xsd http://inetdec.nra.bg/xsd/dec_44a2.xsd"
        })
        .ele("name").txt("ЛИНКСЕТ ЕООД").up()
        .ele("bulstat").txt("203984325").up()
        .ele("telcode").txt("0884").up()
        .ele("telnum").txt("515001").up()
        .ele("authorizeid").txt("8512248444").up()
        .ele("autorizecode").txt("1").up()
        .ele("fname").txt("Антон").up()
        .ele("sname").txt("Христов").up()
        .ele("tname").txt("Вълков").up()
        .ele("id").txt(eik).up()
        .ele("code").txt("5").up()
        .ele("fuiasutd")
            .ele("rowenum")
                .ele("fdrid").txt(fdrid).up()
            .up()
        .up()
        .end({ prettyPrint: true });
}

app.post("/generate-xml", async (req, res) => {
    const { eik, fdrid } = req.body;

    if (!eik || !fdrid) return res.status(400).send("Missing fields");

    const xml = generateXml(eik, fdrid);
    const filename = `export_${eik}_${Date.now()}.xml`;
    
    const filePath = path.join(__dirname, "public", filename);

    fs.writeFileSync(filename, xml, "utf8");
    console.log("📁 Записване в директория:", process.cwd());
    const fileUrl = `${req.protocol}://${req.get("host")}/downloads/${filename}`;
res.status(200).send(`✅ XML файл създаден: <a href="${fileUrl}" target="_blank">${filename}</a>`);
    
    // Тук можеш да извикаш функции за изпращане по имейл и FTP
    

//    console.log(`✅ XML файл създаден: ${fileUrl}`);
//    res.status(200).json({ downloadUrl: fileUrl });

});

//app.listen(3000, () => console.log("🚀 Server listening on port 3000"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

