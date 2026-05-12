import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Edit3, Trash2, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { getBlogsFromDB, addBlogToDB, updateBlogInDB, deleteBlogFromDB, isSupabaseAvailable } from '../../lib/supabase';
import type { BlogPost } from '../../types';

const emptyBlog: Partial<BlogPost> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: 'Admin',
  date: new Date().toISOString().slice(0, 10),
  readingTime: '5 menit',
  image: '',
  tags: []
};

function buildSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function ManageBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>(emptyBlog);
  const [tagsInput, setTagsInput] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getBlogsFromDB();
      setPosts(data);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      showNotification('error', 'Gagal memuat data blog.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const openAddModal = () => {
    setEditingPost(null);
    setFormData(emptyBlog);
    setTagsInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setTagsInput(post.tags.join(', '));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData(emptyBlog);
    setTagsInput('');
  };

  const handleSave = async () => {
    if (!formData.title?.trim() || !formData.slug?.trim() || !formData.excerpt?.trim() || !formData.content?.trim()) {
      showNotification('error', 'Judul, slug, ringkasan, dan konten wajib diisi.');
      return;
    }

    const finalSlug = buildSlug(formData.slug || formData.title || 'blog-post');
    const payload: Omit<BlogPost, 'id'> = {
      title: formData.title.trim(),
      slug: finalSlug,
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      author: formData.author?.trim() || 'Admin',
      date: formData.date || new Date().toISOString().slice(0, 10),
      readingTime: formData.readingTime || '5 menit',
      image: formData.image?.trim() || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200',
      tags: tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean)
    };

    setIsSaving(true);

    try {
      if (editingPost && editingPost.id) {
        const updated = await updateBlogInDB(editingPost.id, payload);
        if (updated) {
          setPosts((current) => current.map((post) => (post.id === updated.id ? updated : post)));
          showNotification('success', 'Artikel blog berhasil diperbarui.');
          closeModal();
        } else {
          showNotification('error', 'Gagal memperbarui artikel blog.');
        }
      } else {
        const created = await addBlogToDB(payload);
        if (created) {
          setPosts((current) => [created, ...current]);
          showNotification('success', 'Artikel blog berhasil dibuat.');
          closeModal();
        } else {
          showNotification('error', 'Gagal membuat artikel blog.');
        }
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      showNotification('error', 'Terjadi kesalahan saat menyimpan artikel.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return;
    try {
      const removed = await deleteBlogFromDB(id);
      if (removed) {
        setPosts((current) => current.filter((post) => post.id !== id));
        showNotification('success', 'Artikel blog berhasil dihapus.');
      } else {
        showNotification('error', 'Gagal menghapus artikel blog.');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      showNotification('error', 'Terjadi kesalahan saat menghapus artikel.');
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 rounded-2xl px-5 py-4 shadow-2xl text-white ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kelola Blog</h1>
          <p className="mt-2 text-slate-500">Tambah, edit, dan hapus artikel blog yang tersimpan di Supabase.</p>
          {!isSupabaseAvailable && (
            <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Supabase belum terhubung. Artikel akan disimpan secara lokal sampai konfigurasi Supabase diatur.
            </div>
          )}
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Tambah Artikel
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">Daftar Artikel</h2>
          <p className="text-sm text-slate-500">Semua artikel yang sudah dibuat akan muncul di sini.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center text-slate-500">Belum ada artikel blog. Klik tombol Tambah Artikel untuk membuat.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Judul</th>
                  <th className="px-6 py-4 text-left font-semibold">Penulis</th>
                  <th className="px-6 py-4 text-left font-semibold">Tanggal</th>
                  <th className="px-6 py-4 text-left font-semibold">Slug</th>
                  <th className="px-6 py-4 text-left font-semibold">Tag</th>
                  <th className="px-6 py-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 font-semibold text-slate-900">{post.title}</td>
                    <td className="px-6 py-4">{post.author}</td>
                    <td className="px-6 py-4">{post.date}</td>
                    <td className="px-6 py-4 lowercase text-blue-600">{post.slug}</td>
                    <td className="px-6 py-4">{post.tags.join(', ')}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(post)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        <Edit3 className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => post.id && handleDelete(post.id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{editingPost ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h3>
                <p className="text-sm text-slate-600">Simpan artikel ke Supabase agar dapat ditampilkan di website.</p>
              </div>
              <button onClick={closeModal} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Judul Artikel</span>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Slug</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="contoh-blog-rental"
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Penulis</span>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Tanggal</span>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Ringkasan</span>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Konten Artikel</span>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Waktu Baca</span>
                  <input
                    type="text"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                    placeholder="Contoh: 5 menit"
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">URL Gambar</span>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Tag (pisahkan dengan koma)</span>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="tips, liburan, rental"
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BookOpen className="mr-2 h-5 w-5" />}
                Simpan Artikel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
