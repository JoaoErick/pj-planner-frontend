import { CheckCircle2, CircleDashed, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";

interface GuestsProps {
  openGuestsModal: () => void
}

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
}

export function Guests({openGuestsModal}: GuestsProps) {
  const { tripId } = useParams()
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    api.get(`trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))
  }, [tripId])

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      {participants.length > 0 && (
        <div className="space-y-6">
          {participants.map((participant, index) => {
            return (
              <div key={index} className="flex items-center">
                <div className="space-y-1.5 flex flex-col">
                  <span className="text-base font-medium text-zinc-100">{participant.name ?? `Convidado ${index}`}</span>
                  <span className="text-xs text-zinc-400 truncate">
                    {participant.email}
                  </span>
                </div>

                {participant.is_confirmed ? (
                  <CheckCircle2 className="size-5 text-lime-300 ml-auto shrink-0" />
                ) : (
                  <CircleDashed className="size-5 text-zinc-400 ml-auto shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      )}

      <button onClick={openGuestsModal} className="text-base font-medium w-full px-5 gap-2 py-2 bg-zinc-800 transition duration-500 text-zinc-200 rounded-lg flex items-center justify-center hover:bg-zinc-700">
        <UserCog className="size-5" />
        Gerenciar convidados
      </button>
    </div>
  )
}