const {format} = require('timeago.js');
const handlebars = require('handlebars');

const helpers = {}

helpers.timeago = (timestamp) =>{
    return format(timestamp);
}


handlebars.registerHelper('isActived', (value)=>{
    if (value === "actived"){
        return '<span class="badge bg-success" >Activo</span>'
    }else{
        return ' <span class="badge bg-danger">Desactivo</span>'
    };
});

handlebars.registerHelper('activedDisabled', (value)=>{
    if (value === "actived") {
        return 'Activado';
    } else {
        return 'Desacticado';
    }
});

handlebars.registerHelper('dateFormat', (value)=>{
    if (value !== '0000-00-00') {
        var date = new Date(value),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
        console.log(value)
        return [day, month ,date.getFullYear()].join("/")
    } else {
        console.log('no hay fecha')
    }
})

module.exports = helpers, handlebars;