import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import useTitle from '../lib/useTitle';
import StudioForm from '../components/StudioForm';
import { PageHeader } from '../components/ui';

export default function AddStudio() {
  useTitle('Add New Studio');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await api.post('/studios', data);
    toast.success('Your studio is live on StudioSpace!');
    navigate('/my-listings');
  };

  return (
    <>
      <PageHeader eyebrow="Become a host" title="Add a New Studio" sub="Tell creators about your space. You can edit or remove the listing at any time." />
      <div className="container-x max-w-4xl py-10">
        <StudioForm onSubmit={onSubmit} submitLabel="Publish Studio" busyLabel="Publishing…" />
      </div>
    </>
  );
}
