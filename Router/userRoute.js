

const {Applicants} = require("./Model/User")

//signup route
app.post("/signup", async(req, res) =>{
    try{
        const {firstName, lastName, email, password} = req.body;

        //check if email already exist
        const userExist = await Applicants.findOne({email});
        if(userExist){
            return rea.status(405).json({
                message: 'Email already exits'
            })
        }
        await Applicants.create({
            firstName,
            lastName,
            email,
            password
        })
        res.status(201).json({
            message: "Applicant successfully registered"
        })
    }catch(error){
        console.error("Error during Sign up", error);
        res.status(500).json({
            message: 'server error'
        })
    };
});