import { Plus } from "lucide-react";
import { DestinationAndDateHeader } from "./destination-and-date-header";
import { Activities } from "./activities";
import { ImportantLinks } from "./important-links";
import { useState } from "react";
import { CreateLinkModal } from "./create-link-modal";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { CreateActivityModal } from "./create-activity-modal";
import { Guests } from "./guests";
import { ManageGuestsModal } from "./manage-guests-modal";

export function TripDetailsPage() {
  const { tripId } = useParams()

  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false)
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)

  const [linkTitle, setLinkTitle] = useState('')
  const [linkURL, setLinkURL] = useState('')

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true)
  }

  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false)
  }

  function openCreateLinkModal() {
    setIsCreateLinkModalOpen(true)
  }

  function closeCreateLinkModal() {
    setIsCreateLinkModalOpen(false)
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true)
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false)
    window.document.location.reload()
  }

  async function createLink() {
    if (!tripId) {
      return
    }

    if (!linkTitle || !linkURL) {
      return
    }

    await api.post(`/trips/${tripId}/links`, {
      title: linkTitle,
      url: linkURL
    })

    window.document.location.reload()
  }

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
      <DestinationAndDateHeader />

      <main className="flex gap-16 px-8 flex-col md:flex-row">
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between flex-wrap space-y-3 lg:space-y-0">
            <h2 className="text-3xl text-zinc-50 font-semibold">Atividades</h2>
            <button onClick={openCreateActivityModal} className="text-base font-medium bg-lime-300 transition duration-500 text-lime-950 rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-lime-400">
              <Plus className="size-5" />
              Cadastrar atividade
            </button>
          </div>

          <Activities />
        </div>
        <div className="w-80 space-y-8">
          <ImportantLinks openCreateLinkModal={openCreateLinkModal} />

          <div className="w-full h-px bg-zinc-800"></div>

          <Guests openGuestsModal={openGuestsModal} />
        </div>
      </main>

      {isCreateLinkModalOpen && (
        <CreateLinkModal
          closeCreateLinkModal={closeCreateLinkModal}
          setLinkTitle={setLinkTitle}
          setLinkURL={setLinkURL}
          createLink={createLink}
        />
      )}

      {isCreateActivityModalOpen && (
        <CreateActivityModal
          closeCreateActivityModal={closeCreateActivityModal}
        />
      )}

      {isGuestsModalOpen && (
        <ManageGuestsModal
          closeGuestsModal={closeGuestsModal}
          tripId={tripId}
        />
      )}
    </div>
  )
}