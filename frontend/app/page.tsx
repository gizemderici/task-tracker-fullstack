'use client';

import { useEffect, useState } from 'react';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
  createdAt: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Orta');
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  async function getTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    const data = await response.json();
    setTasks(data);
  }

  async function addTask() {
    if (!title.trim()) return;

    await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority }),
    });

    setTitle('');
    setPriority('Orta');
    getTasks();
  }

  async function deleteTask(id: number) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE',
    });

    getTasks();
  }

  async function completeTask(id: number) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PATCH',
    });

    getTasks();
  }

  function getPriorityStyle(priority: string) {
    if (priority === 'Yüksek') return 'bg-red-100 text-red-600';
    if (priority === 'Orta') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-600';
  }

  useEffect(() => {
    getTasks();
  }, []);

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(searchText.toLowerCase());

  if (filter === 'active') {
    return !task.completed && matchesSearch;
  }

  if (filter === 'completed') {
    return task.completed && matchesSearch;
  }

  return matchesSearch;
});

  return (
    <main className="min-h-screen bg-slate-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Görev Takip</h1>
          <p className="text-sm text-slate-500 mt-1">
            Günlük görevlerini kolayca yönet
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-slate-800">{tasks.length}</p>
            <p className="text-xs text-slate-500">Toplam</p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-blue-600">{activeCount}</p>
            <p className="text-xs text-slate-500">Aktif</p>
          </div>

          <div className="bg-green-50 rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-green-600">
              {completedCount}
            </p>
            <p className="text-xs text-slate-500">Biten</p>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Yeni görev ekle..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-slate-200 rounded-2xl px-3 py-3 text-sm"
          >
            <option value="Düşük">Düşük</option>
            <option value="Orta">Orta</option>
            <option value="Yüksek">Yüksek</option>
          </select>

          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-5 rounded-2xl text-sm font-semibold hover:bg-blue-700"
          >
            Ekle
          </button>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-xl text-sm ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Tümü
          </button>

          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-2 rounded-xl text-sm ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-600'
            }`}
          >
            Aktif
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-2 rounded-xl text-sm ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-600'
            }`}
          >
            Tamamlanan
          </button>
        </div>
        <div className="mb-5">
  <input
    type="text"
    placeholder="Görev ara..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>

        <div className="space-y-3">
          {filteredTasks.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-6">
              Henüz görev yok.
            </p>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-slate-50 rounded-2xl p-4"
            >
              <div>
                <span
                  className={`text-sm ${
                    task.completed
                      ? 'line-through text-slate-400'
                      : 'text-slate-800'
                  }`}
                >
                  {task.title}
                </span>

                <span
                  className={`ml-2 text-xs px-2 py-1 rounded-full ${getPriorityStyle(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>

              <div className="flex gap-2">
                {!task.completed && (
                  <button
                    onClick={() => completeTask(task.id)}
                    className="text-green-600 text-sm font-semibold"
                  >
                    Tamamla
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 text-sm font-semibold"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}