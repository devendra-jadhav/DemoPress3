using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using Press3.BusinessRulesLayer;
using Press3.Utilities;
using Press3.UI.CommonClasses;
using Newtonsoft.Json.Linq;


namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Scripts
    /// </summary>
    public class Scripts : IHttpHandler, IRequiresSessionState
    {
        int accountId = 0;
        int agentId = 0;
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["accountId"] != null)
                {
                    accountId = Convert.ToInt32(context.Session["accountId"]);
                    agentId = Convert.ToInt32(context.Session["agentId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }
                
                JObject resJObj = new JObject();
                int type = Convert.ToInt32(context.Request["type"]);
                switch (type)
                {                    
                    case 1: //To Get Scripts
                        resJObj = GetScripts(context);
                        context.Response.Write(resJObj);
                        break;
                    case 2: //Create Scripts
                        resJObj = Create(context);
                        context.Response.Write(resJObj);
                        break;
                    case 3: //Get Script for Validation
                        resJObj = Script(context);
                        context.Response.Write(resJObj);
                        break;
                    case 4:// To Delete Scripts
                        resJObj = Delete(context);
                        context.Response.Write(resJObj);
                        break;
                    case 5:// To View Scripts
                        resJObj = ViewScripts(context);
                        context.Response.Write(resJObj);
                        break;
                    case 6 :// To Update Script
                        resJObj = Update(context);
                        context.Response.Write(resJObj);
                        break;
                    case 7:// Scripts data
                        resJObj = GetScriptsSectionsTopics(context);
                        context.Response.Write(resJObj);
                        break;
                    case 8 : // To Delete Section
                        resJObj = DeleteSection(context);
                        context.Response.Write(resJObj);
                        break;
                    case 9: //To Delete Topic
                        resJObj = DeleteTopic(context);
                        context.Response.Write(resJObj);
                        break;
                    case 10: // To Upload The Sections in the Excel file                    
                        resJObj = UploadExcelSections(context);                        
                        context.Response.Write(resJObj);
                        break;
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }


        }
        public JObject GetScripts(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Scripts ScriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = ScriptObj.GetScripts(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject Create(HttpContext context)
        {
            JObject resultObj = new JObject();
            string script = context.Request["data"];
            try
            {
                Press3.BusinessRulesLayer.Scripts ScriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = ScriptObj.Create(MyConfig.MyConnectionString, script,accountId,agentId);
              
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject Script(HttpContext context)
        {
            JObject resultObj = new JObject();
            string scriptTitle = context.Request["scriptTitle"];
            try
            {
                Press3.BusinessRulesLayer.Scripts ScriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = ScriptObj.Script(MyConfig.MyConnectionString, accountId,scriptTitle);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject Delete(HttpContext context)
        {
            JObject resultObj = new JObject();
            int scriptId =Convert.ToInt32( context.Request["scriptId"]);
            try
            {
                Press3.BusinessRulesLayer.Scripts ScriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = ScriptObj.Delete(MyConfig.MyConnectionString,accountId,scriptId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject ViewScripts(HttpContext context)
        {
            JObject resultObj = new JObject();
            int scriptId = Convert.ToInt32(context.Request["scriptId"]);
            try
            {
                Press3.BusinessRulesLayer.Scripts scriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = scriptObj.ViewScript(MyConfig.MyConnectionString, accountId, scriptId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject Update(HttpContext context)
        {
            JObject resultObj = new JObject();
            string script = context.Request["data"];
            try
            {
                Press3.BusinessRulesLayer.Scripts ScriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = ScriptObj.Update(MyConfig.MyConnectionString, script,accountId,agentId);

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject GetScriptsSectionsTopics(HttpContext context)
        {
            JObject resultObj = new JObject();
            string script = context.Request["data"];
            try
            {
                Press3.BusinessRulesLayer.Scripts ScriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = ScriptObj.GetScriptsSectionsTopics(MyConfig.MyConnectionString,Convert.ToInt32(context.Request["skillGroupId"]),Convert.ToInt32(context.Request["scriptId"]),Convert.ToInt32(context.Request["sectionId"]),accountId,Convert.ToInt32(context.Request["mode"]));

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject DeleteSection(HttpContext context)
        {
            JObject resultObj = new JObject();
            int scriptId = Convert.ToInt32(context.Request["scriptId"]);
            int sectionId = Convert.ToInt32(context.Request["sectionId"]);
            try
            {
                Press3.BusinessRulesLayer.Scripts ScriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = ScriptObj.DeleteSection(MyConfig.MyConnectionString, accountId,scriptId, sectionId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject DeleteTopic(HttpContext context)
        {
            JObject resultObj = new JObject();
            
            int sectionId = Convert.ToInt32(context.Request["sectionId"]);
            int topicId = Convert.ToInt32(context.Request["topicId"]);
            try
            {
                Press3.BusinessRulesLayer.Scripts ScriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = ScriptObj.DeleteTopic(MyConfig.MyConnectionString, accountId, sectionId,topicId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }

        public JObject UploadExcelSections(HttpContext context)
        {
            JObject resultObj = new JObject();
            string fileName = context.Request["path"].ToString();
            string xlSheetData = context.Request["semidata"].ToString();
            string header = context.Request["header"];
            string scriptTitle = context.Request["scriptTitle"];
            int skillGroupId = Convert.ToInt32( context.Request["skillGroupId"]);
            int check = Convert.ToInt32(context.Request["check"]);
            string excelUploadPath = HttpContext.Current.Server.MapPath("~/ScriptFileUpload/");
            try
            {
                Press3.BusinessRulesLayer.Scripts ScriptObj = new Press3.BusinessRulesLayer.Scripts();
                resultObj = ScriptObj.UploadExcelSections(MyConfig.MyConnectionString, excelUploadPath,fileName, xlSheetData, header,scriptTitle,skillGroupId,check,accountId,agentId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}