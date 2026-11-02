import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import useTitle from '../lib/useTitle';
import StudioForm from '../components/StudioForm';
import { EmptyState, PageHeader, Spinner } from '../components/ui';

export default function EditStudio() {
  useTitle('Update Studio');
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/studios/${id}`).then(setStudio).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner label="Loading listing" />;
  if (!studio || studio.ownerEmail !== user.email?.toLowerCase())
    return (
      <div className="container-x py-20">
        <EmptyState icon="🔒" title="You can't edit this listing" text="It either doesn't exist or belongs to another host." actionLabel="Go to my listings" actionTo="/my-listings" />
      </div>
    );

  const onSubmit = async (data) => {
    await api.put(`/studios/${id}`, data);
    toast.success('Listing updated successfully.');
    navigate('/my-listings');
  };

  return (
    <>
      <PageHeader eyebrow="Manage listing" title={`Update ${studio.title}`} sub="Changes go live for creators as soon as you save." />
      <div className="container-x max-w-4xl py-10">
        <StudioForm initial={studio} onSubmit={onSubmit} submitLabel="Save Changes" busyLabel="Saving…" />
      </div>
    </>
  );
}
