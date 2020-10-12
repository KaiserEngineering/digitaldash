package KEApp::Model::Config;
use strict;
use warnings;

sub UpdateGauges {
  my $view = shift;
  my %args = (
    @_
  );

  # It ain't pretty but it will do as an MVP
  my @current_gauges = @{$view->{'gauges'}};

  my @gauges = ();
  my $i = 0;
  foreach my $pid ( @{ $args{'pid'} } ) {
      push @gauges, {
            %{$current_gauges[$i]},
            "path" => "\/$view->{'theme'}\/",
            "pid"  => $args{"pid"}[$i]
      };
      $i = $i + 1;
  }
  delete $view->{"pid"};
  $view->{'gauges'} = \@gauges;
}

sub UpdateAlerts {
  my $view = shift;
  my %args = (
    @_
  );

  $view->{'alerts'} = [{
    "message"  => $args{'alertMessage'},
    "op"       => $args{'alertOP'},
    "priority" => $args{'alertPriority'},
    "unit"     => $args{'alertUnit'},
    "value"    => $args{'alertValue'},
  }];
}

sub UpdateDynamic {
  my $view = shift;
  my %args = (
    @_
  );

  $view->{'dynamic'} = {
    "op"       => $args{'dynamicOP'},
    "priority" => $args{'dynamicPriority'},
    "unit"     => $args{'dynamicUnit'},
    "value"    => $args{'dynamicValue'},
    "pid"      => $args{'dynamicPID'},
  };
}

1;
