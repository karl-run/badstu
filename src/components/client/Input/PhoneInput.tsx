'use client';

import React, { ReactElement } from 'react';
import { Form, FormError, FormInput, FormLabel, useFormStore } from '@ariakit/react';
import { useRouter } from 'next/navigation';

function PhoneInput({ userPhone }: { userPhone: string | null }): ReactElement {
  const router = useRouter();
  const form = useFormStore({ defaultValues: { number: userPhone ?? '' } });

  form.useSubmit(async (state) => {
    const newNumber = state.values.number;
    await fetch('/profile/edit-number', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: newNumber }),
    });

    router.refresh();
  });

  return (
    <Form store={form} className="mt-4">
      <button
        className="mt-4 rounded bg-blue-200 p-2 dark:bg-blue-700 dark:text-blue-100"
        type="submit"
      >
        Oppdater
      </button>
    </Form>
  );
}

export default PhoneInput;
