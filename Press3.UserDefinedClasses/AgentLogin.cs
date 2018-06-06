using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class AgentLogin
    {
        public String Name { get; set; }
        public String Password { get; set; }
        public String IpAddress { get; set; }
        public String Browser { get; set; }
        public ulong IpAddressRange { get; set; }
        public Boolean IsV6 { get; set; }
        public Byte IsLogout { get; set; }
    }
}
