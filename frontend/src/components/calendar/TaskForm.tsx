import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CalendarEvent, Case } from '@/types';
import { localDateTimeToISO, TASK_PRIORITIES, TASK_STATUSES } from './constants';

interface TaskFormProps {
  cases: Case[];
  events: CalendarEvent[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function TaskForm({ events, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
    calendar_event_id: '',
    estimated_hours: '',
  });

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-white">Create New Task</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="task_title" className="text-zinc-300">Title *</Label>
          <Input
            id="task_title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Task title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority" className="text-zinc-300">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {TASK_PRIORITIES.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status" className="text-zinc-300">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {TASK_STATUSES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="assigned_to" className="text-zinc-300">Assigned To</Label>
            <Input
              id="assigned_to"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Assignee name"
            />
          </div>

          <div>
            <Label htmlFor="due_date" className="text-zinc-300">Due Date</Label>
            <Input
              id="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="task_event" className="text-zinc-300">Link to Event *</Label>
          <Select value={formData.calendar_event_id} onValueChange={(value) => setFormData({ ...formData, calendar_event_id: value })}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id.toString()}>
                  {e.title} - {new Date(e.start_time).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="task_description" className="text-zinc-300">Description</Label>
          <Textarea
            id="task_description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
            rows={3}
            placeholder="Task details..."
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
              calendar_event_id: formData.calendar_event_id ? parseInt(formData.calendar_event_id) : undefined,
              due_date: formData.due_date ? localDateTimeToISO(formData.due_date) : undefined,
              estimated_hours: formData.estimated_hours ? parseInt(formData.estimated_hours) : undefined,
            };
            onSubmit(submitData);
          }}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!formData.title || !formData.calendar_event_id}
        >
          Create Task
        </Button>
      </div>
    </div>
  );
}
