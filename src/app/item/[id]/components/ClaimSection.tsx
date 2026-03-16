"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimService } from "@/services/claimService";
import { ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import ChatRoom from "@/components/ChatRoom";

export function ClaimSection({ itemId, item, claims, currentUserId }: any) {
  const queryClient = useQueryClient();
  const [selectedClaimId, setSelectedClaimId] = useState<number | null>(null);
  const [activeClaimId, setActiveClaimId] = useState<number | null>(null);

  const finderId = item.finder?.id;
  const isMyItem = currentUserId === finderId;
  const myExistingClaim = claims?.find((c: any) => (c.loser?.id || c.loserId) === currentUserId);

  let displayClaimId = activeClaimId || myExistingClaim?.id || (isMyItem && claims?.length > 0 ? claims[0].id : null);

  const claimMutation = useMutation({
    mutationFn: () => claimService.createClaim(Number(itemId)),
    onSuccess: (data) => {
      toast.success("Item claimed!");
      setActiveClaimId(data.id);
      queryClient.invalidateQueries({ queryKey: ["claims", itemId] });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ claimId, action }: any) => claimService.resolveClaim(claimId, action),
    onSuccess: (_, variables) => {
      toast.success(`Claim ${variables.action.toLowerCase()}d!`);
      queryClient.invalidateQueries({ queryKey: ["claims", itemId] });
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      setSelectedClaimId(null);
    },
  });

  // VIEW 1: YOU ARE THE FINDER
  if (isMyItem) {
    if (!claims || claims.length === 0) {
      return (
        <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900">Waiting for Claims</h3>
          <p className="text-xs text-gray-400 mt-2">No one has claimed this yet.</p>
        </div>
      );
    }

    if (selectedClaimId) {
      return (
        <div className="flex flex-col gap-3">
          <button onClick={() => setSelectedClaimId(null)} className="text-xs text-blue-600 font-bold flex items-center">
            <ArrowLeft className="w-3 h-3 mr-1" /> Back to all claims
          </button>
          <div className="bg-white rounded-2xl border p-1"><ChatRoom claimId={selectedClaimId} /></div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => resolveMutation.mutate({ claimId: selectedClaimId, action: "APPROVE" })} className="bg-green-600 text-white py-3 rounded-xl font-bold text-xs uppercase shadow-md">Approve</button>
            <button onClick={() => resolveMutation.mutate({ claimId: selectedClaimId, action: "REJECT" })} className="bg-red-500 text-white py-3 rounded-xl font-bold text-xs uppercase shadow-md">Reject</button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-5">Received Claims ({claims.length})</h3>
        <div className="grid gap-4">
          {claims.map((claim: any) => (
            <div key={claim.id} className="border p-4 rounded-xl bg-gray-50/50 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">{claim.loser?.name || "User"}</p>
                <span className="text-[10px] uppercase font-bold text-yellow-600">{claim.status}</span>
              </div>
              <button onClick={() => setSelectedClaimId(claim.id)} className="bg-white text-blue-600 border border-blue-100 px-4 py-2 rounded-lg text-xs font-bold shadow-sm">Chat</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // VIEW 2: YOU ARE THE CLAIMER (Conversing)
  if (displayClaimId) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-blue-600 text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Claim Active • Chatting with {item.finder.name}
        </div>
        <div className="bg-white rounded-2xl border p-1"><ChatRoom claimId={displayClaimId} /></div>
      </div>
    );
  }

  // VIEW 3: INITIAL STATE (Claim Button)
  return (
    <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Is this yours?</h3>
      <button onClick={() => claimMutation.mutate()} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all">
        {claimMutation.isPending ? "Connecting..." : "Initiate Claim"}
      </button>
    </div>
  );
}