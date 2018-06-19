// Functions for back-end task optimization

Date.prototype.addMinutes = function(m) 
{    
   this.setTime(this.getTime() + (m*60*1000)); 
   return this;   
}

/* Convert API-formatted date to JS-compatible format */
/* This and the below ended up being simpler than expected so may not be necessary */
function date_APItoJS(apiDate)
{
    var date = new Date(apiDate);
    return date;
}

/* Convert JS-formatted date to API-compatible format */
function date_JStoAPI(jsDate)
{
    return jsDate.toISOString();
}

/* Block object for blocks of free time */
function Block(start, end) 
{
    this.startDate = new Date(start);
    this.endDate = new Date(end);
}

Block.prototype.duration = function() 
{
    var dur = this.endDate - this.startDate; 
    return dur / 1000 / 60 / 60;
}

/* WorkBlock item for task-completion appointments to add to calendar */
function WorkBlock(task, start, end) 
{
    this.startDate = start;
    this.endDate = end;
    this.task = task;
}

/* Task object for list of tasks */
function Task(title, duration, deadline) 
{
    this.title = title;
    this.duration = duration;
    this.deadline = new Date(deadline);
    this.remDuration = duration;
}

/* Function to take list of appointments from calendar and determine blocks of free time */
function detFreeTime(appointments)
{
    
    var freeBlocks = new Array();
    
    var curStartDate = new Date(); // Start at least 30 minutes from now, since we're in planning mode
    curStartDate.addMinutes(30);
    var curEndDate = new Date(appointments[0].startDate);

    for (let curAppt of appointments)
    {
        curEndDate = new Date(curAppt.startDate); // For the first block, the currentAppt start date is at least 30 minutes from now, start the first block of
                                        // free time 30 min from now and end it at the next appt
        var minEndDate = new Date(curStartDate);
        minEndDate.addMinutes(30);
        if(curEndDate >= minEndDate) // Don't use a block of time less than 30 minutes long; keep iterating until you find space
        {
            var curBlock = new Block(curStartDate, curEndDate);
            freeBlocks.push(curBlock);
        }
        
        curStartDate = new Date(curAppt.endDate);
    }
    curEndDate = new Date(curStartDate);
    curEndDate.addMinutes(360);
    curBlock = new Block(curStartDate, curEndDate);
    freeBlocks.push(curBlock);
    return freeBlocks;
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
            var startDate = new Date(freeBlocks[0].startDate);
            var endDate = new Date(startDate);
            endDate.addMinutes(minDuration*60);
            var curWork = new WorkBlock(curTask.title, startDate, endDate);
            workBlocks.push(curWork);
            curTask.duration = curTask.duration - minDuration;
            var compareDate = new Date(endDate);
            compareDate.addMinutes(30);
            freeBlocks[0].startDate = new Date(endDate);
            if (compareDate >= freeBlocks[0].endDate)
                freeBlocks.splice(0,1);
        }
    }
    console.log(workBlocks);
    return workBlocks;
}

function generateWorkBlocks(tasks, appointments)
{
    var freeBlocks = detFreeTime(appointments);
    var workBlocks = blockSelection(tasks, freeBlocks);
    return workBlocks;
}
