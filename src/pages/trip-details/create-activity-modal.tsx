import { FormEvent, useEffect, useState } from "react"
import { api } from "../../lib/axios"
import { useParams } from "react-router-dom"
import { Calendar, Clock, Tag, X } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void
}

interface Trip {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function CreateActivityModal({ closeCreateActivityModal }: CreateActivityModalProps) {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()

  useEffect(() => {
    api.get(`trips/${tripId}`)
    .then(response => setTrip(response.data.trip))
  }, [tripId])

  const [title, setTitle] = useState('')
  const [occursDate, setOccursDate] = useState<Date | undefined>()
  const [occursTime, setOccursTime] = useState('')

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  function openDatePicker() {
    setIsDatePickerOpen(true)
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false)
  }

  async function createActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title || !occursDate || !occursTime) {
      return
    }

    const [day, month, year] = occursDate.toLocaleDateString().split('/').map(part => parseInt(part, 10));
    const [hours, minutes, seconds] = occursTime.split(':').map(part => parseInt(part, 10));

    const occursAt = new Date(year, month - 1, day, hours, minutes, seconds)

    if (trip?.starts_at && trip?.ends_at && (occursAt < new Date(trip?.starts_at) || occursAt > new Date(trip?.ends_at))) {
      return
    }

    await api.post(`trips/${tripId}/activities`, {
      title,
      occurs_at: occursAt
    })

    window.document.location.reload()
  }

  return (
    <div className="fixed -inset-8 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>
            <button type="button" onClick={closeCreateActivityModal} >
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form onSubmit={createActivity} className='space-y-3'>
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="text-zinc-400 size-5" />
            <input
              type="text"
              name="title"
              placeholder="Qual a atividade?"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              onChange={event => setTitle(event.target.value)}
            />
          </div>
          <div className="flex items-center w-full gap-2">
            <button onClick={openDatePicker} className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 flex-1">
              <Calendar className="size-5 text-zinc-400" />
              <span className="text-lg text-zinc-400 w-40 flex-1 text-left">
                {occursDate ? format(occursDate, "d' de 'LLL' de 'yyyy", { locale: ptBR }) : format(new Date(), "d' de 'LLL' de 'yyyy", { locale: ptBR })}
              </span>
            </button>
            <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
              <Clock className="size-5 text-zinc-400" />
              <input
                type="time"
                className="text-lg text-zinc-400 w-40 flex-1 text-left outline-none foc bg-transparent hide-time-picker"
                onChange={event => setOccursTime(event.target.value.concat(':00'))}
              >
              </input>
            </div>
          </div>

          {isDatePickerOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
              <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Selecione a data</h2>
                    <button type="button" onClick={closeDatePicker} >
                      <X className="size-5 text-zinc-400" />
                    </button>
                  </div>
                </div>

                <DayPicker
                  mode="single"
                  locale={ptBR}
                  selected={occursDate}
                  onSelect={setOccursDate}
                  classNames={{
                    selected: `border-lime-500 text-zinc-900 rounded-full bg-lime-400`,
                    chevron: `fill-zinc-300`,
                  }}
                />
              </div>
            </div>
          )}

          <button type="submit" className="text-base font-medium bg-lime-300 transition duration-500 w-full justify-center text-lime-950 rounded-lg px-5 h-11 flex items-center gap-2 hover:bg-lime-400">
            Salvar atividade
          </button>
        </form>
      </div>
    </div>
  )
}