using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class AccountSetting
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string CallerAttributesXml { get; set; }
        public bool AllowAgentsToAcceptCallsFromExternalSipUA { get; set; }
        public bool AllowAgentsToAcceptCallsFromPSTN { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }

    }
}
