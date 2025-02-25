import { Dialog } from '@headlessui/react';
import { useState } from 'react';

type ProcessoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (processo: any) => void;
};

export function ProcessoModal({ isOpen, onClose, onSave }: ProcessoModalProps) {
  const [formData, setFormData] = useState({
    client: '',
    number: '',
    court: '',
    status: 'Em andamento'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6">
          <Dialog.Title className="text-lg font-bold mb-4">
            Novo Processo
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos do formulário */}
            <div>
              <label className="block text-sm font-medium mb-1">Número do Processo</label>
              <input
                type="text"
                required
                className="w-full rounded border p-2"
                onChange={(e) => setFormData({...formData, number: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}