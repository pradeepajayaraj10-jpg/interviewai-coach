import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, Building2, Briefcase, Award, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { IUserProfile } from '../types/interview.ts';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: IUserProfile | null;
  onSave: (updated: Partial<IUserProfile>) => Promise<void>;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [experienceLevel, setExperienceLevel] = useState<IUserProfile['experienceLevel']>('Fresher');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setCollege(profile.college || '');
      setDepartment(profile.department || '');
      setTargetRole(profile.targetRole || 'Software Developer');
      setExperienceLevel(profile.experienceLevel || 'Fresher');
      setSkills(profile.skills || []);
      setBio(profile.bio || '');
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !college.trim() || !targetRole.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        name: name.trim(),
        college: college.trim(),
        department: department.trim(),
        targetRole: targetRole.trim(),
        experienceLevel,
        skills,
        bio: bio.trim(),
      });
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const commonSkills = [
    'Data Structures',
    'Algorithms',
    'React',
    'Node.js',
    'Python',
    'Java',
    'SQL',
    'System Design',
    'Machine Learning',
    'Git',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Candidate Profile</h2>
              <p className="text-xs text-indigo-200">
                AI customizes questions based on your background and target aspirations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully! Adapting question bank...</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-xs text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Experience Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-xs text-slate-900 font-medium bg-white"
              >
                <option value="Fresher">Fresher (New Graduate / 0 yrs)</option>
                <option value="Student (Pre-Final/Final Year)">Student (Pre-Final/Final Year)</option>
                <option value="Intern">Intern / Co-Op</option>
                <option value="1-2 Years">Junior Professional (1-2 Years)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* College / University */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                College / University <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-xs text-slate-900 font-medium"
              />
            </div>

            {/* Department / Major */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                Department / Branch
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Target Role */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              Target Job Role <span className="text-rose-500">*</span>
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-xs text-slate-900 font-medium bg-white"
            >
              <option value="Software Developer">Software Developer (General SDE)</option>
              <option value="Java Developer">Java Developer (Spring Boot / Enterprise)</option>
              <option value="Python Developer">Python Developer (Backend / Django / FastApi)</option>
              <option value="Web Developer">Web Developer (React / Full Stack / Node)</option>
              <option value="Data Analyst">Data Analyst (SQL / Pandas / BI)</option>
              <option value="AI-ML Engineer">AI-ML Engineer (Machine Learning / Deep Learning / PyTorch)</option>
            </select>
          </div>

          {/* Skills Management */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                Key Technical & Soft Skills
              </span>
              <span className="text-[11px] text-slate-600">Press Enter or click Add</span>
            </label>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g. Docker, TypeScript, Microservices..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-xs text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
              {skills.length === 0 ? (
                <span className="text-slate-600 text-xs italic self-center">No skills added yet. Add your core languages and frameworks.</span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-800 text-xs font-semibold shadow-xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-600 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Suggested quick skills */}
            <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-600">Quick suggestions:</span>
              {commonSkills
                .filter((s) => !skills.includes(s))
                .slice(0, 5)
                .map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSkills([...skills, skill])}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
            </div>
          </div>

          {/* Short Bio / Elevator Pitch */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Candidate Summary / Target Goals
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Final year CS undergraduate targeting Tier-1 tech placement rounds. Passionate about backend systems and DSA."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none text-xs text-slate-900 font-medium"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving Profile...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
