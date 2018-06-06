using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class DialPlan
    {
        public int Mode { get; set; }
        public string UserContext { get; set; }
        public string ExtensionName { get; set; }
        public string DestinationNumber { get; set; }
        public string GatewayName { get; set; }
        public long DialStartTime { get; set; }
        public long DialEndTime { get; set; }
        public string EventTime { get; set; }
        public string DialALegUUID { get; set; }
        public string DialBLegUUID { get; set; }
        public string PlayFile { get; set; }
        public bool IsInBound { get; set; }
        public string TransferFromNumber { get; set; }
        public string TransferToNumber { get; set; }

    }
}
