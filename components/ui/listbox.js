import { Listbox } from '@headlessui/react';

export const ListboxComponent = ({ options, selected, onChange }) => (
  <Listbox value={selected} onChange={onChange}>
    <Listbox.Button>{selected}</Listbox.Button>
    <Listbox.Options>
      {options.map((option, idx) => (
        <Listbox.Option key={idx} value={option}>
          {option}
        </Listbox.Option>
      ))}
    </Listbox.Options>
  </Listbox>
);
