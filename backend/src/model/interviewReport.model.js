const mongoose = require('mongoose');
/** job description schema
 * resume text
 *  self description
 * 
 *  
 * matchscore :number
 * technical questions :[{queston:""
 * intension: ""
 *  answer:""}]
 * behavioral question :[{queston:""
 * intension: ""
 *  answer:""}]
 * 
 * skill gaps :[ skill:"",
 * severity:""
 * answer
 * type string
 * enum:[low,medium,high]]
 * preparation plam :[{
 * days:Number
 * focus: string
 * tasks[string]}]
 */
const technicalQuestionSchema = new mongoose.Schema({
    question:{
   type: String,
   required:[ true,"Technical question is required"]

     },
     intention:{
        type: String,
        required:[true,"intention is required"]
     },

     answer:{
        type:String,
        required:[true,"Answer is required"]
     }
    },
     {
        _id: false
     
})
 const behaviourQuestionsSchema= new mongoose.Schema({
    question:{
   type: String,
   required:[ true,"behaviour question is required"]

     },
     intention:{
        type: String,
        required:[true,"intention is required"]
     },

     answer:{
        type:String,
        required:[true,"Answer is required"]
     }
    },
     {
        _id: false
     
}
 )
 const skillgapSchema= new mongoose.Schema({
    skills:{ 
        type: String,
        required:[true,"skills is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true, "severity is required"]
    }
},
    { _id: false  
 })
  const preparationPlanSchema=new mongoose.Schema({
     day:{
        type:Number,
        required:[ true," day is required"]
     },
     focus:{
        type: String,
        required:[ true,"focus is required"]
     },
     tasks:[{
        type: String,
        required:[ true," task is required"]
     }]

     
  })
const interviewReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    jobDescription:{
        type: String,
        required:[ true," job description is required"]
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type: String,
    },
    title:{
        type: String,
    }, matchScore:{
        type: Number,
        min: 0,
        max:100,
    },
    technicalQuestions:[technicalQuestionSchema],
    behaviourQuestions: [behaviourQuestionsSchema],
    skillgap: [skillgapSchema],
    preparationPlan: [preparationPlanSchema]
})
 const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema)
 module.exports =interviewReportModel;