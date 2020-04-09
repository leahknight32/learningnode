
const mjml2html = require('mjml');

const readXlsxFile = require('read-excel-file/node');

const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "neha.pouros@ethereal.email", // generated ethereal user
            pass: "PAe7K2NGRRQvvFe7Fp" // generated ethereal password
        }
    });

    // File path.
    let excelfile = await readXlsxFile('morning checks template.xlsx')
    console.log(excelfile) 

    /*
      Compile an mjml string
    */
    const htmlOutput = mjml2html(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table>
        ${excelfile.map(row => `<tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
        ${row.map(cell => `<th style="padding: 0 15px 0 0;">${cell}</th>`)}
      </tr>`)}
        </mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`)

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: htmlOutput.html // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);