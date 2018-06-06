using System;
using System.Threading;
using System.Threading.Tasks;
using System.Text;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Data;
using System.Data.SqlClient;

namespace Press3.BusinessRulesLayer
{
    public class WsConfPubSubState
    {
        HashSet<WsConfSubscriber> subscribers;
        HashSet<WsConfSubscriber> disposedSubs;
        public ManualResetEvent hashSetChangeDone = new ManualResetEvent(true);
        public Int32 noOfBroadcasters = 0;
        public Int32 noOfModifiers = 0;
        public WsConfPubSubState(String channelName)
        {
            subscribers = new HashSet<WsConfSubscriber>();
        }
        public async Task BroadcastToSubscribers(String message)
        {
            ArraySegment<byte> outputBuffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(message));
            hashSetChangeDone.WaitOne();
            lock (this)
            {
                ++noOfBroadcasters;
            }
            try
            {
                foreach (WsConfSubscriber subscriber in subscribers)
                {
                    Boolean gotSignal = false;
                    try
                    {
                        if (subscriber.subSocket.State == WebSocketState.Open)
                        {
                            gotSignal = subscriber.autoREvent.WaitOne();
                            await subscriber.subSocket.SendAsync(outputBuffer, WebSocketMessageType.Text, true, CancellationToken.None);
                        }
                        else
                        {
                            if (disposedSubs == null) disposedSubs = new HashSet<WsConfSubscriber>();
                            disposedSubs.Add(subscriber);
                        }
                    }
                    catch (System.ObjectDisposedException de)
                    {
                        disposedSubs.Add(subscriber);
                        //logger.Error("Error while BroadcastToSubscribers msg->" + message, de);
                    }
                    catch (Exception e)
                    {
                        //logger.Error("Error while BroadcastToSubscribers msg->" + message, e);
                    }
                    finally
                    {
                        if (gotSignal) subscriber.autoREvent.Set();
                    }
                }

            }
            finally
            {
                lock (this)
                {
                    if (--noOfBroadcasters == 0)
                    {
                        if (disposedSubs != null && disposedSubs.Count > 0)
                        {
                            //foreach (WsConfSubscriber subscriber in disposedSubs)
                            //{
                            //    logger.Info("Removing DisposedWebSocket..." + subscriber.GetHashCode() + " " + subscribers.Remove(subscriber));
                            //}
                            disposedSubs = null;
                        }
                        Monitor.PulseAll(this);
                    }
                }

            }
        }
        public Boolean AddSubscriber(WsConfSubscriber subscriber)
        {
            bool result = false;
            lock (this)
            {
                if (noOfModifiers++ == 0)
                {
                    hashSetChangeDone.Reset();
                }
                if (noOfBroadcasters > 0)
                {
                    Monitor.Wait(this);
                }
            }
            try
            {
                result = subscribers.Add(subscriber);
            }
            finally
            {
                lock (this)
                {
                    if (--noOfModifiers == 0)
                    {
                        hashSetChangeDone.Set();
                    }
                }
            }
            return result;
        }
        public void RemoveSubscriber(WsConfSubscriber subscriber)
        {
            lock (this)
            {
                if (noOfModifiers++ == 0)
                {
                    hashSetChangeDone.Reset();
                }
                if (noOfBroadcasters > 0)
                {
                    Monitor.Wait(this);
                }
            }
            try
            {
                subscribers.Remove(subscriber);
                if (disposedSubs != null) disposedSubs.Remove(subscriber);
            }
            finally
            {
                lock (this)
                {
                    if (--noOfModifiers == 0)
                    {
                        hashSetChangeDone.Set();
                    }
                }
            }
        }
    }
}
