using System;
using System.Net.WebSockets;
using System.Threading;

namespace Press3.BusinessRulesLayer
{
    public class WsConfSubscriber
    {
        public WebSocket subSocket;
        public AutoResetEvent autoREvent;
        public WsConfSubscriber(WebSocket socket)
        {
            subSocket = socket;
            autoREvent = new AutoResetEvent(true);
        }
    }
}

