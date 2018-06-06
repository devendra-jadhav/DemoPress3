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
    /// Summary description for Skills
    /// </summary>
    public class Skills : IHttpHandler, IRequiresSessionState
    {
        int accountId = 0;
        int agentId = 0;

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["AccountId"] != null)
                {
                    accountId = Convert.ToInt32(context.Session["AccountId"]);
                    agentId = Convert.ToInt32(context.Session["AgentId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }
                JObject resJObj = new JObject();
                int type = Convert.ToInt32(context.Request["type"]);
                switch(type)
                {
                case 1: // To Get SkillDetails
                        resJObj = GetSkills(context);
                        context.Response.Write(resJObj);
                        break;
                case 2: // To Create Skill
                        resJObj = Create(context);
                        context.Response.Write(resJObj);
                        break;
                case 3: // To Update skill
                        resJObj = Update(context);
                        context.Response.Write(resJObj);
                        break;
                case 4: // To Delete skill
                        resJObj = Delete(context);
                        context.Response.Write(resJObj);
                        break;
               case 5: // To Get Skill
                        resJObj = GetSkill(context);
                        context.Response.Write(resJObj);
                        break;
             
                
               }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }


        }
        public JObject GetSkills(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Skill skillObj = new Press3.BusinessRulesLayer.Skill();
                resultObj = skillObj.GetSkills(MyConfig.MyConnectionString, accountId);
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
            string Name = context.Request["Name"];
            string Description = context.Request["Description"];
            try
            {
                UserDefinedClasses.Skill skillEntity = new UserDefinedClasses.Skill();
                skillEntity.AccountId = accountId;
                skillEntity.AgentId = agentId;
                skillEntity.Name = Name;
                skillEntity.Description = Description;
                Press3.BusinessRulesLayer.Skill skillObj = new Press3.BusinessRulesLayer.Skill();
                resultObj = skillObj.Create(MyConfig.MyConnectionString, skillEntity);
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
            int Id = Convert.ToInt32(context.Request["Id"]);
            string Name = context.Request["Name"];
            string Description = context.Request["Description"];
            try
            {
                UserDefinedClasses.Skill skillEntity = new UserDefinedClasses.Skill();
                skillEntity.AccountId = accountId;
                skillEntity.AgentId = agentId;
                skillEntity.Id = Id;
                skillEntity.Name = Name;
                skillEntity.Description = Description;
                Press3.BusinessRulesLayer.Skill skillObj = new Press3.BusinessRulesLayer.Skill();
                resultObj = skillObj.Update(MyConfig.MyConnectionString, skillEntity);
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
            int Id = Convert.ToInt32(context.Request["Id"]);
            string Name = context.Request["Name"];
            try
            {
                UserDefinedClasses.Skill skillEntity = new UserDefinedClasses.Skill();
                skillEntity.AccountId = accountId;
                skillEntity.Id = Id;
                skillEntity.Name = Name;
                Press3.BusinessRulesLayer.Skill skillObj = new Press3.BusinessRulesLayer.Skill();
                resultObj = skillObj.Delete(MyConfig.MyConnectionString, skillEntity);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }
        public JObject GetSkill(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Skill skillObj = new Press3.BusinessRulesLayer.Skill();
                int skillId =Convert.ToInt32(context.Request["Id"]);
                resultObj = skillObj.GetSkill(MyConfig.MyConnectionString, accountId,skillId);
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