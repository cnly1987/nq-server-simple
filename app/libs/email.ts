import nodemailer from 'nodemailer'


let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'admin@awkxy.com', // generated ethereal user
      pass: 'gnqrhvecowfccaad', // generated ethereal password
    },
});


const sendmail = async function(email, host){
  host['ram_p'] = Math.round(host['ram_usage']/host['ram_total']*100)
  host['disk_p'] = Math.round(host['disk_usage']/host['disk_total']*100)
  host['sys_p'] = (host['load_system'] <=100)?host['load_system']:100
  let info = await transporter.sendMail({
    from: '"MonitorX 👻" <admin@awkxy.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `
      <p style="font-size:18px; color:"#500050">Hello, It seems one of your servers is consuming a lot of resources.</p>
      <div style="padding-bottom:20px">
          <p style="font-size:18px; color:"#500050">Server:{name}</p>
          <p>Last Update:{updated_at}</p>
      </div>
      <div style="padding-bottom:20px">
          <p>Average:${host.loads}</p>
          <p>System Load:${host.sys_p}%</p>
          <p>Ram Usage:${host.ram_p}%</p>
          <p>Disk Usage:${host.disk_p}%</p>
      </div>
      <div>
          If you don't want to receive alerts anymore, log into your account and edit the notification settings for your server.<br>
          Feel free to reply to this message if you are experiencing problems with our services.<br>
          Thanks,<br>
          MonitorX
      </div>
    `, // html body
  });
  return info
}

export default sendmail