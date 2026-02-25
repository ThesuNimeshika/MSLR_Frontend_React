import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

interface RowData {
    id: number;
    name: string;
    role: string;
    status: string;
}

const columns = [
    {
        name: 'Name',
        selector: (row: RowData) => row.name,
        sortable: true,
    },
    {
        name: 'Role',
        selector: (row: RowData) => row.role,
        sortable: true,
    },
    {
        name: 'Status',
        selector: (row: RowData) => row.status,
    },
];

const data = [
    { id: 1, name: 'Thesara', role: 'Developer', status: 'Active' },
    { id: 2, name: 'Nimeshika', role: 'Manager', status: 'On Leave' },
    { id: 3, name: 'MSL Admin', role: 'Admin', status: 'Active' },
];

const PluginDemo = () => {
    const showAlert = () => {
        Swal.fire({
            title: 'Success!',
            text: 'SweetAlert2 is working perfectly.',
            icon: 'success',
            confirmButtonColor: '#6366f1',
        });
    };

    const showToast = () => {
        toast.success('Hot Toast notification triggered!', {
            style: {
                borderRadius: '10px',
                background: '#1e293b',
                color: '#fff',
            },
        });
    };

    return (
        <div className="mt-10 p-6 glass rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white font-['Outfit']">Plugin Showcase</h2>

            <div className="flex gap-4 mb-8 justify-center">
                <button
                    onClick={showAlert}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                    Test SweetAlert
                </button>
                <button
                    onClick={showToast}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                    Test Hot Toast
                </button>
            </div>

            <div className="mt-6 rounded-xl overflow-hidden border border-white/10">
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    theme="dark"
                    customStyles={{
                        table: {
                            style: {
                                backgroundColor: 'transparent',
                            },
                        },
                        header: {
                            style: {
                                backgroundColor: 'transparent',
                                color: '#fff',
                            },
                        },
                        headRow: {
                            style: {
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                            },
                        },
                        rows: {
                            style: {
                                backgroundColor: 'transparent',
                                color: '#cbd5e1',
                                '&:not(:last-child)': {
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                },
                            },
                        },
                        pagination: {
                            style: {
                                backgroundColor: 'transparent',
                                color: '#cbd5e1',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default PluginDemo;
