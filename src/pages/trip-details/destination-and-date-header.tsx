import { Calendar, MapPin, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
import "react-day-picker/style.css";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange, DayPicker } from "react-day-picker";

interface Trip {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()

  const [isInputEnable, setIsInputEnable] = useState(false)
  const [destination, setDestination] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  useEffect(() => {
    api.get(`trips/${tripId}`)
      .then(response => setTrip(response.data.trip))
      .catch(error => console.error('Error fetching trip:', error));
  }, [tripId]);

  useEffect(() => {
    if (trip) {
      setDestination(trip.destination);
      setEventStartAndEndDates({
        from: new Date(trip.starts_at),
        to: new Date(trip.ends_at),
      });
    }
  }, [trip]);

  function enableInput() {
    setIsInputEnable(true)
  }

  function disableInput() {
    setIsInputEnable(false)
  }

  async function updateTrip() {
    disableInput()

    if (!destination) {
      return
    }

    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
      return
    }

    await api.put(`trips/${tripId}`, {
      destination,
      starts_at: eventStartAndEndDates?.from,
      ends_at: eventStartAndEndDates?.to
    }).catch(error => console.error('Error updating trip:', error))

    window.document.location.reload()
  }

  function openDatePicker() {
    setIsDatePickerOpen(true)
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false)
  }

  return (
    <div className="md:h-16 bg-zinc-900 px-4 rounded-xl items-center shadow-shape gap-3 py-4 space-y-3 md:space-y-0 md:flex md:flex-row">
      <div className="flex items-center gap-2 flex-1">
        <MapPin className="size-5 text-zinc-400" />
        <input
          disabled={!isInputEnable}
          type="text"
          placeholder="Para onde você vai?"
          className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
          value={destination}
          onChange={event => setDestination(event.target.value)}
        />
      </div>
      <button onClick={openDatePicker} disabled={!isInputEnable} className="flex items-center gap-2 text-left w-[240px]">
        <Calendar className="size-5 text-zinc-400" />
        <span className="text-lg text-zinc-400 w-40 flex-1">
          {
            eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to 
            && format(eventStartAndEndDates.from, "d' de 'LLL", { locale: ptBR }).concat(' até ').concat(format(eventStartAndEndDates.to, "d' de 'LLL", { locale: ptBR })) 
          }
        </span>
      </button>

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
              mode="range" 
              locale={ptBR}
              selected={eventStartAndEndDates} 
              onSelect={setEventStartAndEndDates}
              classNames={{
                selected: `border-lime-500 text-lime-500`,
                chevron: `fill-zinc-300`,
              }}
            />
          </div>
        </div>
      )}

      <div className="w-px h-6 hidden md:block bg-zinc-800" />

      {isInputEnable ? (
        <button onClick={updateTrip} className="w-full justify-center md:w-auto md:justify-normal bg-lime-300 text-base text-lime-950 transition duration-300 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400">
          Salvar
        </button>
      ) : (
        <button onClick={enableInput} className="w-full justify-center md:w-auto md:justify-normal bg-zinc-800 text-zinc-200 transition duration-300 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-zinc-700">
          <Settings2 className="size-5" />
          Alterar local/data
        </button>
      )}
    </div>
  )
}