import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Issue, Comment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/formatters';
import {useIssues} from "../../contexts/IssueContext.tsx";

interface IssueCommentsProps {
  issue: Issue;
}

const IssueComments: React.FC<IssueCommentsProps> = ({ issue }) => {
  const { user } = useAuth();
  const { addComment } = useIssues();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await addComment(issue.id, newComment, user.id);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Commentaires ({issue.comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="input flex-grow"
              disabled={isSubmitting}
              required
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-gray-600 text-sm">
            Vous devez être connecté pour commenter.
          </p>
        </div>
      )}
      
      {issue.comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun commentaire pour le moment.</p>
          <p className="text-gray-500 text-sm mt-1">Soyez le premier à commenter !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {issue.comments
            .slice()
            .reverse()
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center mb-2">
        <img
          src={`https://ui-avatars.com/api/?name=${comment.userId}&background=10B981&color=fff`}
          alt="Avatar"
          className="h-8 w-8 rounded-full mr-3"
        />
        <div>
          <div className="font-medium text-gray-800">Citoyen</div>
          <div className="text-xs text-gray-500">{formatDate(comment.createdAt)}</div>
        </div>
      </div>
      <p className="text-gray-700 text-sm">{comment.text}</p>
    </div>
  );
};

export default IssueComments;