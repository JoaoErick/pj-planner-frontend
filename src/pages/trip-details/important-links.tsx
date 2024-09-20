import { Link2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";

interface ImportantLinksProps {
  openCreateLinkModal: () => void
}

interface Link {
  id: string
  title: string
  url: string
}

export function ImportantLinks({openCreateLinkModal}: ImportantLinksProps) {
  const { tripId } = useParams()
  const [links, setLinks] = useState<Link[]>([])

  useEffect(() => {
    api.get(`trips/${tripId}/links`).then(response => setLinks(response.data.links))
  }, [tripId])

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Links importantes</h2>

      {links.length > 0 && (
        <div className="space-y-6">
          {links.map((link, index) => {
            return (
              <div key={index} className="flex items-center">
                <div className="space-y-1.5 flex flex-col">
                  <span className="text-base font-medium text-zinc-100">{link.title}</span>
                  <a href={link.url} className="text-xs text-zinc-400 truncate hover:text-zinc-200" target="_blank">
                    {link.url}
                  </a>
                </div>

                <Link2 className="size-5 text-zinc-400 ml-auto shrink-0" />
              </div>
            )
          })}
        </div>
      )}

      <button onClick={openCreateLinkModal} className="text-base font-medium w-full px-5 gap-2 py-2 bg-zinc-800 transition duration-500 text-zinc-200 rounded-lg flex items-center justify-center hover:bg-zinc-700">
        <Plus className="size-5" />
        Cadastrar novo link
      </button>
    </div>
  )
}