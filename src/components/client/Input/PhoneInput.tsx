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
      <div className="flex flex-col">
        <FormLabel name={form.names.number} className="mb-1 text-sm">
          Telefonnummer
        </FormLabel>
        <FormInput
          name={form.names.number}
          className="rounded border p-2 sm:max-w-xs dark:bg-slate-800 dark:text-white"
          type="tel"
          required
          minLength={8}
          maxLength={8}
          placeholder="Kun norsk nummer er gyldig"
        />
        <FormError
          name={form.names.number}
          className="my-2 rounded border bg-red-100 p-2 empty:absolute empty:hidden sm:max-w-xs dark:bg-red-800 dark:text-white"
        />
      </div>
      <button className="mt-4 rounded bg-blue-200 p-2 dark:bg-blue-700 dark:text-blue-100" type="submit">
        Oppdater
      </button>
    </Form>
  );
}

export default PhoneInput;
