"use client";

import { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import clsx from 'clsx';

interface Message {
  id: string;
  body: string;
  sender_id: string;
  client_id: string;
  created_at: string;
  read_at: string | null;
  sender?: { full_name: string; role: string } | null;
}

interface MessagingTabProps {
  clientId: string;
  clientEmail: string;
}

const ADMIN_SENDER_ID = process.env.NEXT_PUBLIC_ADMIN_PROFILE_ID || 'admin';

export default function MessagingTab({ clientId, clientEmail }: MessagingTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const { showToast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages for this client
    const channel = supabase
      .channel(`messages_${clientId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `client_id=eq.${clientId}`
      }, async (payload) => {
        const newMsg = payload.new as any;
        // Fetch sender info
        const { data: sender } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', newMsg.sender_id)
          .single();

        setMessages(prev => [...prev, { ...newMsg, sender } as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, body, sender_id, client_id, created_at, read_at, sender:profiles!messages_sender_id_fkey(full_name, role)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as any) || []);
    } catch (error) {
      console.error('Fetch messages error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgContent = newMessage;
    setNewMessage('');

    try {
      const { error } = await supabase.from('messages').insert({
        client_id: clientId,
        sender_id: ADMIN_SENDER_ID,
        body: msgContent,
      });

      if (error) throw error;
      showToast("Message sent", "success");
    } catch (error) {
      showToast("Failed to send message", "error");
      setNewMessage(msgContent);
    }
  }

  const isOutbound = (msg: Message) => msg.sender_id !== clientId;

  return (
    <div className="flex flex-col h-[600px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Messaging Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-baulin-gold/10 rounded-lg text-baulin-gold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Client Messages</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{clientEmail}</p>
          </div>
        </div>
        <button
          onClick={() => { fetchMessages(); showToast("Messages refreshed", "success"); }}
          className="flex items-center gap-2 text-[10px] font-bold text-baulin-gold uppercase hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Message List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
      >
        {messages.length === 0 && !loading ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => {
            const outbound = isOutbound(msg);
            const senderName = (msg.sender as any)?.full_name || (outbound ? 'Staff' : 'Client');

            return (
              <div
                key={msg.id}
                className={clsx(
                  "flex flex-col max-w-[85%]",
                  outbound ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[9px] font-black uppercase text-gray-600 tracking-tighter">
                    {outbound ? `Sent by ${senderName}` : senderName}
                  </span>
                  <span className="text-[9px] text-gray-700">
                    {new Date(msg.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <div className={clsx(
                  "p-4 rounded-2xl border text-sm shadow-xl",
                  outbound
                    ? "bg-baulin-gold text-black border-baulin-gold/20 rounded-tr-none"
                    : "bg-white/5 text-gray-200 border-white/10 rounded-tl-none backdrop-blur-md"
                )}>
                  <p className="whitespace-pre-wrap">{msg.body}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Composer */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white/[0.02] border-t border-white/10">
        <div className="flex gap-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
            placeholder="Type a message..."
            className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-baulin-gold/50 resize-none h-20"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="self-end p-4 bg-baulin-gold text-black rounded-xl hover:bg-white transition-all disabled:opacity-30 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
