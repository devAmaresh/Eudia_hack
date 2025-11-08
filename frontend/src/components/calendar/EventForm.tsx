import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Case } from '@/types';
import { formatDateTimeLocal, localDateTimeToISO, EVENT_TYPES } from './constants';

interface EventFormProps {
  cases: Case[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  preSelectedDate?: Date | null;
}

export function EventForm({ cases, onSubmit, onCancel, preSelectedDate }: EventFormProps) {
  const getInitialDates = () => {
    if (preSelectedDate) {
      const start = new Date(preSelectedDate);
      start.setHours(9, 0, 0, 0); // 9 AM
      const end = new Date(preSelectedDate);
      end.setHours(10, 0, 0, 0); // 10 AM
      return {
        start_time: formatDateTimeLocal(start),
        end_time: formatDateTimeLocal(end),
      };
    }
    return { start_time: '', end_time: '' };
  };

  const initialDates = getInitialDates();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'hearing',
    location: '',
    start_time: initialDates.start_time,
    end_time: initialDates.end_time,
    case_id: '',
    color: '#3b82f6',
    participants: [] as any[],
  });

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-white">Create New Event</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-zinc-300">
            Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Event title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="event_type" className="text-zinc-300">
              Type *
            </Label>
            <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="case" className="text-zinc-300">
              Case
            </Label>
            <Select value={formData.case_id} onValueChange={(value) => setFormData({ ...formData, case_id: value })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select case" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {cases.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.case_number} - {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_time" className="text-zinc-300">
              Start Time *
            </Label>
            <Input
              id="start_time"
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="end_time" className="text-zinc-300">
              End Time *
            </Label>
            <Input
              id="end_time"
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="text-zinc-300">
            Location
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Location or court room"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-zinc-300">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
            rows={3}
            placeholder="Event details..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} className="border-zinc-700">
          Cancel
        </Button>
        <Button
          onClick={() => {
            const submitData = {
              ...formData,
              case_id: formData.case_id ? parseInt(formData.case_id) : undefined,
              start_time: localDateTimeToISO(formData.start_time),
              end_time: localDateTimeToISO(formData.end_time),
            };
            onSubmit(submitData);
          }}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!formData.title || !formData.start_time || !formData.end_time}
        >
          Create Event
        </Button>
      </div>
    </div>
  );
}
