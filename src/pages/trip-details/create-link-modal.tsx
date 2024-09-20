import { Link2, Tag, X } from "lucide-react";

interface CreateLinkModalProps {
  closeCreateLinkModal: () => void
  createLink: () => void
  setLinkTitle: (title: string) => void
  setLinkURL: (url: string) => void
}

export function CreateLinkModal({ closeCreateLinkModal, createLink, setLinkTitle, setLinkURL }: CreateLinkModalProps) {
  return (
    <div className="fixed -inset-8 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar link</h2>
            <button type="button" onClick={closeCreateLinkModal} >
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar os links importantes.
          </p>
        </div>

        <form onSubmit={createLink} className='space-y-3'>
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="text-zinc-400 size-5" />
            <input
              type="text"
              name="title"
              placeholder="Título do link"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              onChange={event => setLinkTitle(event.target.value)}
            />
          </div>
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Link2 className="text-zinc-400 size-5" />
            <input
              type="text"
              name="url"
              placeholder="URL"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              onChange={event => setLinkURL(event.target.value)}
            />
          </div>

          <button type="submit" className="text-base font-medium bg-lime-300 transition duration-500 w-full justify-center text-lime-950 rounded-lg px-5 h-11 flex items-center gap-2 hover:bg-lime-400">
            Salvar link
          </button>
        </form>
      </div>
    </div>
  )
}