using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using UDC = Press3.UserDefinedClasses;
using Press3.Utilities;
using System.Data;



namespace Press3.BusinessRulesLayer
{
    public class Skill
    {
        private Helper _helper = null;
        public Skill()
        {
            _helper = new Helper();
            _helper.ResponseFormat = UDC.ResponseFormat.JSON;
            _helper.InitializeResponseVariables();
        }
        public JObject GetSkills(string connectionString, int accountId, int skillId = 0)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Skill skillObj = new DataAccessLayer.Skill(connectionString);
                    System.Data.DataSet ds = skillObj.GetSkills(accountId, skillId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
        public JObject Create(string connectionString, UDC.Skill skillEntity)
        {
            try
            {
                if (skillEntity.AccountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else if (skillEntity.Name == null || skillEntity.Name.Trim().Length == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "Skill name is mandatory");
                }
                else
                {
                    DataAccessLayer.Skill skillObj = new DataAccessLayer.Skill(connectionString);
                    System.Data.DataSet ds = skillObj.Create(skillEntity);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                    }
                    else
                        _helper.ParseDataSet(ds);
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
       
        public JObject Delete(String connection, UDC.Skill skillEntity)
        {
            try
            {
                if (skillEntity.AccountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    Press3.DataAccessLayer.Skill skillObj = new Press3.DataAccessLayer.Skill(connection);
                    System.Data.DataSet ds = skillObj.Delete(skillEntity);
                        
                    if (ds == null)
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
        public JObject Update(String connection, UDC.Skill skillEntity)
        {
            try
            {
                if (skillEntity.Id == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "Id is mandatory");
                }
                else
                {
                    DataAccessLayer.Skill skillObj = new DataAccessLayer.Skill(connection);
                    DataSet ds = new DataSet();
                    ds = skillObj.Update(skillEntity);
                    if (ds == null)
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                    }
                    else
                        _helper.ParseDataSet(ds);
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
        public JObject GetSkillGroup(string connectionString, int accountId)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Skill skillObj = new DataAccessLayer.Skill(connectionString);
                    System.Data.DataSet ds = skillObj.GetSkillGroup(accountId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject GetSkill(string connectionString, int accountId, int skillId)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Skill skillObj = new DataAccessLayer.Skill(connectionString);
                    System.Data.DataSet ds = skillObj.GetSkill(accountId, skillId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, skillObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
    }
}
