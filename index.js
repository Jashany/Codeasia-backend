import Express from "express";
import dotenv from "dotenv";
import ConnectDB from "./db/index.js";
import User from "./model/user.model.js";
import cors from "cors";
import fetch from "node-fetch";
import nodemailer from 'nodemailer';
import Settings from "./model/settings.model.js";
import ApprovedUser from "./model/approveduser.model.js";
import Admin from "./model/admin.model.js";
   
const app = Express();
dotenv.config();
app.use(cors());


app.use(Express.json());

app.post("/api/form_entry", async (req, res) => {
    try {
        const { name, age, email, state, study, answer, newsletter } = req.body;
        const newuser = new User({ name, age, email, state, study, answer, newsletter });
        await newuser.save();
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/api/viewall", async (req, res) => {
    try {
        const allUser = await User.find();
        res.status(200).json(allUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/delete/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId)
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/mail_yes', async (req, res) => {
    try {
        const { id, mail_status } = req.body;

        // Find user by id and update mail_status
        const user = await User.findByIdAndUpdate(id, { mail_status }, { new: true });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (error) {
        console.error('Error updating mail status:', error);
        res.status(500).send('Server error');
    }
});

app.put('/api/mail_no', async (req, res) => {
    try {
        const { id, mail_status } = req.body;
        // Find user by id and update mail_status
        const user = await User.findByIdAndUpdate(id, { mail_status }, { new: true });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (error) {
        console.error('Error updating mail status:', error);
        res.status(500).send('Server error');
    }
});

app.post("/api/sendmail/:name/:age/:study/:email/:state/:newsletter", async (req, res) => {
    try {
        const { name, age, study, email, state, newsletter } = req.params;
        const emailTemplate = await fetch('https://codeasia.vercel.app/emailTemplate.html').then(response => response.text());
        const approvedUser = new ApprovedUser({ name, age, study, email, state, newsletter });
        await approvedUser.save();
        const link = await Settings.findOne({}).select('slack_id');
        console.log(link.slack_id)
        // Customize the template with user data
        const emailNewsLetterX = newsletter ? "" : "NOT";
        let template = emailTemplate
            .replace("name__Name_6846198749_Name", name)
            .replace("schoolType__SchoolType_69436873_SchoolType", study || "")
            .replace("name__Name_6846198749_Name", name)
            .replace("state_State_68768_State", state || "")
            .replace("age_Age_34987_Age", age || "")
            .replace("emailNewsLetter_654654_EmailNewsLetter", emailNewsLetterX)
            .replace("https://join.slack.com/t/codeasia/shared_invite/zt-uys86oxj-eE3JvoVmsCzkRzdijakItg", link.slack_id);

 
        // Nodemailer configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'join-us@codeasia.org',
                pass: 'mnza fjqj dsml iszg'
            }
        });

        // Email options
        const mailOptions = {
            from: 'join-us@codeasia.org',
            to: email,
            subject: 'Welcome to CodeAsia!',
            html: template
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        res.json({ message: 'Email sent successfully!', emailInfo: info });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/slack_id', async (req, res) => {

    try {
        const { slack_id } = req.body;
        const settings = await Settings.findOneAndUpdate({}, { slack_id }, { upsert: true, new: true });
        res.status(200).json({ message: "Slack ID saved successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username, password });
        if (!admin) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        // If login is successful, include user data in the response
        res.status(200).json({ message: 'Login successful', user: admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



ConnectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on PORT ${process.env.PORT}`);
    });
});





