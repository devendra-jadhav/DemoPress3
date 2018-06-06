using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Press3.UserDefinedClasses
{
   public class Validator
    {
        public string TextValidate(string _Data, string _DataMode = "PlainText")
        {
            return "OK";
            string _Resp = "OK";
            string PlainText = "~___`___!___@___#___$___%___^___&___*___(___)___<___>___?___:___;___/___\\___-___[___]___{___}___|___=___+____";
            string Password = "~___`___!___@___#___$___%___^___&___*___(___)___<___>___?___:___;___/___\\___-___[___]___{___}___|___=___+____";
            string Email = "~___`___!___#___$___%___^___&___*___(___)___<___>___?___:___;___/___\\___-___[___]___{___}___|___=___+,____";
            string Url = "";
            string CheckRe = "";
            try
            {
                _DataMode = _DataMode.ToUpper();
                if (_DataMode == "PLAINTEXT")
                {
                    CheckRe = PlainText;
                }
                else if (_DataMode == "PASSWORD")
                {
                    CheckRe = Password;
                    return "OK";
                }
                else if (_DataMode == "EMAIL")
                {
                    CheckRe = Email;
                }
                else if (_DataMode == "URL")
                {
                    CheckRe = Url;
                }
                else
                {
                    CheckRe = PlainText;
                }
                foreach (string _Char in CheckRe.Split(new string[] { "___" }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (_Data.Contains(_Char))
                    {
                        return "Invalid Characters Found";
                    }
                }
            }
            catch (Exception ex)
            {
                _Resp = "Exception";
            }
            return _Resp;
        }
        public void DisableCache()
        {
            HttpContext.Current.Response.ExpiresAbsolute = DateTime.Now.AddDays(-1);
            HttpContext.Current.Response.Expires = -1500;
            HttpContext.Current.Response.CacheControl = "no-cache";

        }
        public string ExtraCharReplacer(string _Data, string _type)
        {

            string characters = "~___`___!___#___$___%___^___&___*___(___)___<___>___?___:___;___/___\\___-___[___]___{___}___'___|___=___+,____";
            
            foreach (string _Char in characters.Split(new string[] {"___"}, StringSplitOptions.RemoveEmptyEntries))
            {
                if (_Data.Contains(_Char))
                {
                    if (_type == "text")
                    {
                        _Data = _Data.Replace(_Char, " ");
                    }
                    else
                    {
                        _Data = _Data.Replace(_Char, "");
                    }
                }
            }
            return _Data;
        }
    }
}
