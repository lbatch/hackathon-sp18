/* Function to take list of appointments from calendar and determine blocks of free time */
function detFreeTime(appointments)
{
    return;
}

/* Convert API-formatted date to JS-compatible format */
function date_APItoJS(apiDate)
{
    return;
}

/* Convert JS-formatted date to API-compatible format */
function date_JStoAPI(jsDate)
{
    return;
}

/* Block object for blocks of free time */
function Block(start, end) {
    this.startDate = new Date(start);
    this.endDate = new Date(end);
}

Block.prototype.duration = function() {
    var dur = this.endDate - this.startDate; 
    return dur / 1000 / 60 / 60;
}

/* WorkBlock item for task-completion appointments to add to calendar */
function WorkBlock(task, start, end) {
    Block.call(start, end);
    this.task = task;
}

/* Task object for list of tasks */
function Task(title, duration, deadline) {
    this.title = title;
    this.duration = duration;
    this.deadline = new Date(deadline);
    this.remDuration = duration;
}

function blockSelection(tasks, freeBlocks)
{
    var workBlocks = new Array();
    
    tasks.sort(function(a,b){
        return new Date(a.deadline) - new Date(b.deadline);
    });

    freeBlocks.sort(function(a,b){
        return new Date(a.startDate) - new Date(b.startDate);
    });

    for (let curTask of tasks)
    {
        while(curTask.duration > 0)
        {
            var minDuration = curTask.duration;
            var blockDuration = freeBlocks[0].duration();
            if(blockDuration < minDuration)
                minDuration = blockDuration;
            var startDate = freeBlocks[0].startDate;
            var curWork = new WorkBlock(curTask.title, startDate, startDate.getTime() + minDuration*60*60*1000);
            workBlocks.push(curWork);
            curTask.duration = curTask.duration - minDuration;
            freeBlocks[0].startDate = startDate.getTime() + minDuration*60*60*1000;
            if (freeBlocks[0].startDate >= freeBlocks[0].endDate - 15*60000)
                freeBlocks.splice(0,1);
        }
    }
    return curWork;
}

function generateWorkBlocks(tasks, appointments)
{
    var freeBlocks = detFreeTime(appointments);
    var workBlocks = blockSelection(tasks, freeBlocks);
    return workBlocks;
}