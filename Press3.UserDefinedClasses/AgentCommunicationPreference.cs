using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class AgentCommunicationPreference
    {
        public int Id { get; set; }
        public int AgentId { get; set; }
        public byte CommunicationTypeId { get; set; }
        public Nullable<int> SipUserAccountId { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public Nullable<int> GatewayId { get; set; }
        public Nullable<bool> IsRegistered { get; set; }
    }
}
