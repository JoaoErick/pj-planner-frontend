import { CircleCheck, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  date: string
  activities: {
    id: string
    title: string
    occurs_at: string
  }[]
}

export function Activities() {
  const { tripId } = useParams()
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    api.get(`trips/${tripId}/activities`).then(response => setActivities(response.data.activities))
  }, [tripId])

  function deleteActivity(activityId: string) {
    api.delete(`trips/${tripId}/activities/${activityId}`)
      .then(response => {
        console.log('Activity removed:', response);
        setActivities((prevActivities) =>
          prevActivities.map((activity) => ({
            ...activity,
            activities: activity.activities.filter((act) => act.id !== activityId)
          }))
        );
      })
      .catch(error => {
        console.error('Error removing activity:', error);
      });
  }

  return (
    <div className="space-y-8">
      {activities.map((category) => {
        return (
          <div key={category.date} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl text-zinc-300 font-semibold">Dia {format(category.date, "d")}</span>
              <span className="text-xs text-zinc-500">{format(category.date, "EEEE", { locale: ptBR })}</span>
            </div>
            {category.activities.length > 0 ? (
              category.activities.map((activity) => {
                return (
                  <div key={activity.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-zinc-900 px-4 py-2.5 rounded-xl flex items-center flex-1 shadow-shape gap-3">
                        <CircleCheck className="text-lime-300 size-5" />
                        <span className="text-zinc-100 text-base truncate">{activity.title}</span>
                        <span className="text-zinc-400 text-sm ml-auto">
                          {format(activity.occurs_at, "HH:mm'h'")}
                        </span>
                      </span>
                      <button onClick={() => deleteActivity(activity.id)} className="text-base font-medium px-4 py-3 shadow-shape bg-zinc-900 transition duration-500 text-zinc-400 rounded-lg flex items-center justify-center hover:bg-zinc-800">
                        <Trash className="size-5" />
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
            )}
          </div>
        )
      })}
    </div>
  )
}