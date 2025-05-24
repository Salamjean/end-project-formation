'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import './contact.css';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Ici, vous pouvez ajouter la logique pour envoyer les données à votre backend
      console.log('Form data:', data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contactez-nous</h1>
        <p>Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question.</p>
      </div>

      <div className="contact-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Le nom est requis' })}
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide',
                },
              })}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="subject">Sujet</label>
            <input
              type="text"
              id="subject"
              {...register('subject', { required: 'Le sujet est requis' })}
            />
            {errors.subject && (
              <p className="error-message">{errors.subject.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              {...register('message', { required: 'Le message est requis' })}
            />
            {errors.message && (
              <p className="error-message">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>

          {submitStatus === 'success' && (
            <p className="success-message">
              Votre message a été envoyé avec succès !
            </p>
          )}

          {submitStatus === 'error' && (
            <p className="error-status">
              Une erreur est survenue. Veuillez réessayer.
            </p>
          )}
        </form>
      </div>

      <div className="contact-info">
        <div className="info-card">
          <h3>Adresse</h3>
          <p>
            Abidjan, Côte d'Ivoire<br />
             Marcory, 9ème arrondissement
          </p>
        </div>

        <div className="info-card">
          <h3>Contact</h3>
          <p>
            Téléphone: +225 07 98 27 89 81<br />
            Email: salamjeanlouis8@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
} 