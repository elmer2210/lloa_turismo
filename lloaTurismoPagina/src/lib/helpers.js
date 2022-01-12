const bcryptjs = require('bcryptjs')

const helpers ={};

helpers.encryptPassword = async(password) =>{
    const convertPassword = await bcryptjs.hash(password, 10);
    console.log(convertPassword);
    return convertPassword;
};

helpers.getPassword = async (password, savedPassword) => {
    try {
        return await bcryptjs.compare( password, savedPassword); 
    } catch (error) {
       console.log(error); 
    }
};

module.exports = helpers;