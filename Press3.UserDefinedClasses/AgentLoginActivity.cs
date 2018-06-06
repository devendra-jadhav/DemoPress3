using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class AgentLoginActivity
    {
        public int Id { get; set; }
        public int AgentId { get; set; }
        public bool IsLogin { get; set; }
        public bool IsAuto { get; set; }
        public System.DateTime ActivityTime { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
    }
}
