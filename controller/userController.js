const User = require("../Model/User");

//sign up route

async function Signup(req, res){
    try{
       const {
        firstName,
        lastName,
        age,
        gender,
        country,
        careerStatus,
        email,
        password
       } = req.body;

       //checking if email already exist
       const ExistingUser = await User.findOne({email});

       if (ExistingUser){
        return res.status(405).json({
            message: 'Email already exists'
        })
       }

       await User.create({
        firstName,
        lastName,
        age,
        gender,
        country,
        careerStatus,
        email,
        password
       })
       res.status(201).json({
        message: 'User successfully registered'
       })
    }catch(error){
    console.error('Error during sign-up', error);
     res.status(500).json({
        message: 'Server error'
     })
    
    }
}

//login route
async function login(req, res){
    try{
        const { email, password } = req.body;

        //find user by email
        const findUser = await User.findOne({email});

        if(!findUser){
            return res.status(404).json({
                message: 'User not found'
            });
    }
    //compare the provided password with the stored password
    const isPasswordValid = await bcrypt.compare( password, findUser.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message: 'Invalid email or password'
        })
    }

    res.status(200).json({
        message: 'Login successful',
        userId: findUser._id,
        fname: findUser.firstName,
        lname: findUser.lastName,
        pwd: findUser.password
    })

    }catch(error){
        console.error('Error:', error);
        res.status(500).json({
            message: 'Internal Server error'
        })
    };
};

module.exports={
    Signup,
    login
};