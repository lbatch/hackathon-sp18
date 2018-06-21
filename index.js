// Main back-end program that renders front-end and calls back-end
// task-optimization functions

const express = require('express');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const readline = require('readline');
const google = require('googleapis');
var bodyParser = require('body-parser');	

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post('/api/main', (req,res) => {
    var taskArray = req.body.tasks;
    var eventArray = req.body.events;
    var workArray = generateWorkBlocks(taskArray, eventArray);
    res.send(workArray);
  });

/*app.post('/api/test', (req, res) => {
    console.log(req.body);
    console.log("Thats what we got here!");
    res.send(JSON.stringify({message: "Heres our reply!"}));
});*/

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// ****** TOOLS ******* //
Date.prototype.addMinutes = function(m)
{
   this.setTime(this.getTime() + (m*60*1000));
   return this;
}

/* Convert API-formatted date to JS-compatible format */
/* This and the below ended up being simpler than expected so may not be necessary */
/*function date_APItoJS(apiDate)
{
    var date = new Date(apiDate);
    return date;
}*/

/* Convert JS-formatted date to API-compatible format */
/*function date_JStoAPI(jsDate)
{
    return jsDate.toISOString();
}*/

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
/*function Task(title, duration, deadline)
{
    this.title = title;
    this.duration = duration;
    this.deadline = new Date(deadline);
    this.remDuration = duration;
}*/

/* Add non-working ('rest') blocks to list of appointments, preventing tasks
   from being scheduled during these hours in subsequent steps */
function restrictWorkHours(appointments, tasks)
{
    const WORK_START = 9; // 9 AM
    const WORK_END = 17; // 5 PM
    const DEADLINE_BUFFER = 30; // to add to max deadline in case of overflow

    var restDuration = 24 - (WORK_END - WORK_START);
    if (restDuration > 24)
        restDuration -= 24;

    // Determine how many rest periods to block out
    var maxDeadline = new Date(tasks[0].deadline);
    maxDeadline.setHours(11, 59, 59);
    for (var i = 0; i < tasks.length; i++)
    {
        var curDeadline = new Date(tasks[i].deadline);
        curDeadline.setHours(11, 59, 59);
        if (curDeadline > maxDeadline)
            maxDeadline = curDeadline;
    }

    // Add buffer to ensure rests are included even if we overshoot deadlines
    maxDeadline.setDate(maxDeadline.getDate() + DEADLINE_BUFFER);

    // Generate rest blocks and add them to appointment array
    var restStart = new Date(appointments[0].startDate);
    restStart.setDate(restStart.getDate() - 1); // starting yesterday
    restStart.setHours(WORK_END, 0, 0);
    while (restStart < maxDeadline) // add block each day until last deadline
    {
        var restEnd = new Date(restStart);
        restEnd.setHours(restStart.getHours() + restDuration);

        var restBlock = {
            startDate: new Date(restStart),
            endDate: new Date(restEnd),
            task: "rest",
            newEvent: false
        };
        appointments.push(restBlock); // treat rest time as an appointment

        restStart.setDate(restStart.getDate() + 1); // repeat for next day
    }

    // Sort appointment array to incorporate newly added rest blocks
    appointments.sort(function(a,b){
        return new Date(a.startDate) - new Date(b.startDate);
    });
}

/* Function to take list of appointments from calendar and determine blocks of free time */
function detFreeTime(appointments)
{
    var freeBlocks = new Array();

    var freeStart = new Date(); // current date and time

    // For the first block, the currentAppt start date is at least 30 minutes from now
    if(freeStart.getMinutes() < 30)
        freeStart.addMinutes(30-freeStart.getMinutes());
    else
        freeStart.addMinutes(60-freeStart.getMinutes());

    if(appointments.length)
    {
        // End the first block of free time at the next appt
        var freeEnd = new Date(appointments[0].startDate);
        for (let curAppt of appointments)
        {
            // Only consider appt if it ends after the previous appt ends
            var nextStart = new Date(curAppt.endDate);
            if (nextStart > freeStart)
            {
                // Try block from end of previous to start of current appointment
                freeEnd = new Date(curAppt.startDate);
                                            
                var minEndDate = new Date(freeStart);
                minEndDate.addMinutes(30);
                
                // Don't use a block of time less than 30 minutes long; keep
                // iterating until you find space
                if(freeEnd >= minEndDate)
                {
                    var curBlock = new Block(freeStart, freeEnd);
                    freeBlocks.push(curBlock);
                }

                freeStart = new Date(nextStart);
            }
        }
    }
    
    freeEnd = new Date(freeStart);
    freeEnd.addMinutes(60000);
    curBlock = new Block(freeStart, freeEnd);
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
    return workBlocks;
}

function generateWorkBlocks(tasks, appointments) // all times are in the calendar's local time
{
    restrictWorkHours(appointments, tasks);
    var freeBlocks = detFreeTime(appointments);
    var workArray = blockSelection(tasks, freeBlocks);
    return workArray;
}

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Listening on ${port}`);