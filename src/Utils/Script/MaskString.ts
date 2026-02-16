enum MaskPosition {
  Start = 'start',
  Second = 'second',
}

const defaultMaskedCharacter = '*';

class StringMasker {
  static mask(
    input: string,
    position: MaskPosition = MaskPosition.Second
  ): string {
    if (!input) return input;

    // check if it's an email
    const atIndex = input.indexOf('@');
    if (atIndex !== -1) {
      const local = input.slice(0, atIndex);
      const domain = input.slice(atIndex + 1);
      const maskedLocal = this.applyMask(local, position);
      return `${maskedLocal}@${domain}`;
    }

    // raw string case
    return this.applyMask(input, position);
  }

  private static applyMask(raw: string, position: MaskPosition): string {
    if (!raw) return raw;

    switch (position) {
      case MaskPosition.Start: {
        // mask first 4 chars
        return `${defaultMaskedCharacter.repeat(4)}${raw.slice(4)}`;
      }

      case MaskPosition.Second: {
        // keep first char, then 4 stars
        return `${raw[0] ?? ''}${defaultMaskedCharacter.repeat(4)}`;
      }

      default: {
        return raw;
      }
    }
  }
}

function test() {
  console.log(StringMasker.mask('eu39+lucas@18.dev', MaskPosition.Start));
  console.log(StringMasker.mask('eu39+lucas@18.dev', MaskPosition.Second));
  console.log(StringMasker.mask('Chanabcd', MaskPosition.Start));
  console.log(StringMasker.mask('Chanabcd', MaskPosition.Second));
}
test();
