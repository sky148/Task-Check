// module for date function

exports.getdate = function()
{
    var today = new Date();
    var options = {  weekday: 'long', month: 'long', day: 'numeric', };
    var day = today.toLocaleDateString('en-us', options);
    return day;
}

exports.getday = function()
{
    var options = {  weekday: 'long' };
    return new Date().toLocaleDateString('en-us', options);
}